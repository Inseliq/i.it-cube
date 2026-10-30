import { calculateTestResult, getGrade } from '../pages/test/test.logic.js'

const PREFIX = 'it-cube:quiz:v2:'

export function getMaxAttempts(test) {
  if (test.maxAttempts === null || test.maxAttempts === 0) return Infinity
  if (Number.isInteger(test.maxAttempts) && test.maxAttempts > 0) return Math.min(3, test.maxAttempts)
  return test.repeat === false ? 1 : Infinity
}

export function getResultMode(test) {
  if (getMaxAttempts(test) === Infinity) return 'last'
  return test.resultMode === 'last' ? 'last' : 'best'
}

// The record which counts toward the final assessment. For ties keep the first best run.
export function getCreditedAttempt(test, state) {
  const history = Array.isArray(state.history) ? state.history : []
  if (!history.length) return null
  if (getMaxAttempts(test) === Infinity || getResultMode(test) === 'last') return history[history.length - 1]
  return history.reduce((best, current) => current.percent > best.percent ? current : best, history[0])
}

// With limited attempts don't show solutions until the final allowed attempt is used.
export function canRevealAnswers(test, state) {
  return Boolean(test.showAnswersAfterFinish) && (
    getRemainingAttempts(test, state) === 0 || getMaxAttempts(test) === Infinity
  )
}

export function getTimeLimit(test) {
  return Number.isInteger(test.timeLimitSeconds) && test.timeLimitSeconds > 0
    ? test.timeLimitSeconds : null
}

export function getPassingPercent(test) {
  return Number.isFinite(test.passingPercent)
    ? Math.max(0, Math.min(100, test.passingPercent)) : 45
}

export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return 'Без ограничения'
  const safe = Math.max(0, Math.ceil(seconds))
  return [Math.floor(safe / 3600), Math.floor((safe % 3600) / 60), safe % 60]
    .map((n) => String(n).padStart(2, '0')).join(':')
}

export function getRemainingAttempts(test, state) {
  const max = getMaxAttempts(test)
  return max === Infinity ? Infinity : Math.max(0, max - state.attemptsUsed)
}

const emptyState = (test) => ({
  version: test.version ?? 1,
  attemptsUsed: 0,
  active: null,
  lastResult: null,
  hasPassed: false,
  history: [],
})

const storageKey = (test) => `${PREFIX}${test.slug}`

function storage() {
  try {
    const store = globalThis.localStorage
    if (!store) return null
    return store
  } catch {
    return null
  }
}

function cleanAnswers(test, answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return {}
  return Object.fromEntries(test.questions.flatMap((q) => {
    const value = answers[q.id]
    if (q.type === 'input') return typeof value === 'string' ? [[q.id, value.slice(0, 500)]] : []
    const valid = new Set((q.options ?? []).map((option) => option.id))
    if (q.type === 'radio') return valid.has(value) ? [[q.id, value]] : []
    if (q.type === 'checkbox' && Array.isArray(value)) {
      return [[q.id, [...new Set(value.filter((item) => valid.has(item)))]]]
    }
    return []
  }))
}

export function canPersistTest() {
  const store = storage()
  if (!store) return false
  try {
    const key = `${PREFIX}check`
    store.setItem(key, '1')
    store.removeItem(key)
    return true
  } catch {
    return false
  }
}

function persist(test, state) {
  const store = storage()
  if (!store) return false
  try {
    store.setItem(storageKey(test), JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

// One source of truth for quiz state. No cleanup/reset button is exposed to learners.
export function readTestState(test, now = Date.now()) {
  let state = emptyState(test)
  try {
    const parsed = JSON.parse(storage()?.getItem(storageKey(test)) ?? 'null')
    if (parsed && parsed.version === state.version &&
      Number.isSafeInteger(parsed.attemptsUsed) && parsed.attemptsUsed >= 0) {
      state = {
        ...state,
        attemptsUsed: parsed.attemptsUsed,
        hasPassed: parsed.hasPassed === true,
        history: Array.isArray(parsed.history) ? parsed.history.filter((item) => Number.isInteger(item?.number) && Number.isFinite(item?.percent)).slice(-100).map((item) => ({ ...item, grade: getGrade(item.percent) })) : [],
        lastResult: parsed.lastResult && typeof parsed.lastResult === 'object' ? parsed.lastResult : null,
        active: parsed.active && typeof parsed.active === 'object' &&
          typeof parsed.active.id === 'string' && Number.isFinite(parsed.active.startedAt)
          ? { id: parsed.active.id, startedAt: parsed.active.startedAt,
              deadlineAt: Number.isFinite(parsed.active.deadlineAt) ? parsed.active.deadlineAt : null,
              answers: cleanAnswers(test, parsed.active.answers) }
          : null,
      }
    }
  } catch { /* malformed browser storage is safely ignored */ }

  if (state.active && state.active.deadlineAt !== null && now >= state.active.deadlineAt) {
    return completeTest(test, state, now)
  }
  return state
}

export function beginTest(test, now = Date.now()) {
  if (!canPersistTest()) return { state: readTestState(test, now), error: 'Сохранение в браузере недоступно. Разрешите хранение данных для сайта, чтобы начать тест.' }
  const state = readTestState(test, now)
  if (state.active) return { state }
  if (getRemainingAttempts(test, state) <= 0) return { state, error: 'Попытки закончились.' }
  const started = {
    ...state,
    attemptsUsed: state.attemptsUsed + 1,
    active: {
      id: globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random()}`,
      startedAt: now,
      deadlineAt: getTimeLimit(test) ? now + getTimeLimit(test) * 1000 : null,
      answers: {},
    },
    lastResult: null,
  }
  if (!persist(test, started)) return { state, error: 'Не удалось сохранить попытку. Проверьте настройки браузера.' }
  return { state: started }
}

export function answerTestQuestion(test, attemptId, questionId, value, now = Date.now()) {
  const state = readTestState(test, now)
  if (!state.active || state.active.id !== attemptId) return { state, error: 'Попытка уже завершена или открыта в другой вкладке.' }
  const next = { ...state, active: { ...state.active,
    answers: cleanAnswers(test, { ...state.active.answers, [questionId]: value }) } }
  if (!persist(test, next)) return { state, error: 'Не удалось сохранить ответ.' }
  return { state: next }
}

export function completeTest(test, state, now = Date.now()) {
  if (!state.active) return state
  const result = calculateTestResult(test, state.active.answers)
  const timedOut = state.active.deadlineAt !== null && now >= state.active.deadlineAt
  const passed = result.percent >= getPassingPercent(test)
  const summary = {
    percent: result.percent,
    grade: result.grade,
    earnedPoints: result.earnedPoints,
    maxPoints: result.maxPoints,
    passed,
    correctCount: result.details.filter((detail) => detail.correct).length,
    timedOut,
    finishedAt: timedOut ? state.active.deadlineAt : now,
    startedAt: state.active.startedAt,
    answers: state.active.answers,
    number: state.attemptsUsed,
  }
  const next = {
    ...state,
    active: null,
    lastResult: summary,
    hasPassed: state.hasPassed || passed,
    history: [...state.history, {
      number: summary.number, percent: summary.percent, grade: summary.grade,
      correctCount: summary.correctCount, earnedPoints: summary.earnedPoints,
      maxPoints: summary.maxPoints, passed, timedOut,
      finishedAt: summary.finishedAt }].slice(-20),
  }
  persist(test, next)
  return next
}

export function submitTest(test, attemptId, now = Date.now()) {
  const state = readTestState(test, now)
  if (!state.active || state.active.id !== attemptId) return state
  return completeTest(test, state, now)
}

export function getTestStorageKey(test) {
  return storageKey(test)
}
