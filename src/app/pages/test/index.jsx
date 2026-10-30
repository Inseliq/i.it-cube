import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getTestBySlug } from '../../data/tests.map'
import { calculateTestResult } from './test.logic'
import {
  answerTestQuestion, beginTest, canPersistTest, formatDuration,
  canRevealAnswers, getCreditedAttempt, getResultMode, getMaxAttempts, getPassingPercent, getRemainingAttempts, getTestStorageKey,
  getTimeLimit, readTestState, submitTest,
} from '../../utils/testSession'
import '../../styles/css/test.css'

const difficultyLabels = { 1: 'Простой', 2: 'Лёгкий', 3: 'Средний', 4: 'Сложный', 5: 'Контрольный' }

function formatPoints(value) {
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

function AnswerField({ question, value, onChange }) {
  if (question.type === 'input') {
    return <input className="test-input" aria-label={`Ответ: ${question.question}`} type="text"
      maxLength={500} value={value ?? ''} onChange={(e) => onChange(e.target.value)}
      placeholder="Напишите свой ответ" autoComplete="off" />
  }
  return <div className="test-options">
    {question.options.map((option) => {
      const checked = question.type === 'radio'
        ? value === option.id : Array.isArray(value) && value.includes(option.id)
      return <label className={`test-option ${checked ? 'test-option--selected' : ''}`} key={option.id}>
        <input name={question.id} type={question.type} checked={checked} onChange={() => {
          if (question.type === 'radio') return onChange(option.id)
          const current = Array.isArray(value) ? value : []
          onChange(checked ? current.filter((id) => id !== option.id) : [...current, option.id])
        }} />
        <span className="test-option__control" aria-hidden="true" />
        <span>{option.text}</span>
      </label>
    })}
  </div>
}

function answerText(question, value) {
  if (question.type === 'input') return value?.trim() || 'Ответ не дан'
  const ids = question.type === 'radio' ? (value ? [value] : []) : (Array.isArray(value) ? value : [])
  return ids.map((id) => question.options.find((o) => o.id === id)?.text).filter(Boolean).join(', ') || 'Ответ не дан'
}

function correctAnswerText(question) {
  if (question.type === 'input') return (question.answers ?? []).join(' / ')
  return answerText(question, question.type === 'radio' ? question.correctAnswer : question.correctAnswers)
}

function AttemptLabel({ test, state }) {
  const max = getMaxAttempts(test)
  const remaining = getRemainingAttempts(test, state)
  return <>{max === Infinity ? 'Без ограничения попыток' : `Попыток: ${state.attemptsUsed} из ${max}${!state.active ? ` · осталось ${remaining}` : ''}`}</>
}

function AttemptsTable({ test, state }) {
  const credited = getCreditedAttempt(test, state)
  return <section className="card attempts-section" aria-labelledby="attempts-title">
    <div className="attempts-heading"><div><span className="eyebrow">История прохождений</span><h2 id="attempts-title">Все попытки</h2></div>
      <span className="status-pill">Засчитывается {getResultMode(test) === 'best' ? 'лучшая' : 'последняя'}</span></div>
    <div className="attempts-scroll" role="region" aria-label="Таблица результатов попыток" tabIndex={0}>
      <table className="attempts-table"><thead><tr><th scope="col">Попытка</th><th scope="col">Верных ответов</th><th scope="col">Результат</th><th scope="col">Оценка</th></tr></thead>
      <tbody>{state.history.map((item) => <tr key={item.number} className={credited?.number === item.number ? 'attempts-table__credited' : ''}>
        <th scope="row">№ {item.number}{credited?.number === item.number && <span className="attempts-table__mark">Зачётная</span>}</th>
        <td>{Number.isInteger(item.correctCount) ? `${item.correctCount} из ${test.questions.length}` : '−'}</td>
        <td><strong>{item.percent}%</strong></td><td>{item.grade ?? '−'}</td>
      </tr>)}</tbody></table>
    </div>
    <p className="attempts-help">{getResultMode(test) === 'best' ? 'Лучший результат остаётся зачётным, даже если следующая попытка хуже.' : 'При новой попытке зачётный результат заменяется последним, даже если он ниже предыдущего.'}</p>
  </section>
}

function ResultView({ test, state, onStart, error }) {
  const last = state.lastResult
  const result = calculateTestResult(test, last.answers ?? {})
  const credited = getCreditedAttempt(test, state) ?? last
  const remaining = getRemainingAttempts(test, state)
  const showReview = canRevealAnswers(test, state)
  return <div className="test-content">
    <Link to="/tests" className="back-link">← Все тесты</Link>
    <section className="card result-panel">
      <div className="result-panel__icon" aria-hidden="true">{credited.passed ? '✓' : '!'}</div>
      <span className="eyebrow">Попытка №{last.number} завершена</span>
      <h1>{credited.passed ? 'Тест зачтён!' : 'Тест пока не зачтён'}</h1>
      <p>{last.timedOut ? 'Время вышло. Ответы, которые вы успели дать, сохранены и проверены.' : 'Ответы проверены, результат сохранён в этом браузере.'}</p>
      <div className="result-panel__score"><strong>{credited.percent}%</strong><span>Зачётная оценка {credited.grade} · {getResultMode(test) === 'best' ? 'лучшая' : 'последняя'} попытка №{credited.number}</span></div>
      <div className="result-panel__progress" role="progressbar" aria-label="Зачётный результат теста" aria-valuemin={0} aria-valuemax={100} aria-valuenow={credited.percent}><span style={{ width: `${credited.percent}%` }} /></div>
      <p className="test-hint">Последнее прохождение: {last.percent}% · оценка {last.grade}. Для зачёта необходимо {getPassingPercent(test)}%.</p>
      <div className="result-panel__stats">
        <div><span>Зачётные баллы</span><strong>{Number.isFinite(credited.earnedPoints) ? formatPoints(credited.earnedPoints) : '−'} / {formatPoints(credited.maxPoints ?? result.maxPoints)}</strong></div>
        <div><span>Правильных ответов (последняя)</span><strong>{result.details.filter((detail) => detail.correct).length} / {test.questions.length}</strong></div>
        <div><span>Попытки</span><strong>{getMaxAttempts(test) === Infinity ? state.attemptsUsed : `${state.attemptsUsed} / ${getMaxAttempts(test)}`}</strong></div>
      </div>
      {error && <p className="test-error" role="alert">{error}</p>}
      <div className="test-actions">
        {remaining > 0 && <button type="button" className="btn btn-primary" onClick={onStart}>Пройти ещё раз <span aria-hidden="true">→</span></button>}
        <Link to="/tests" className="btn btn-outline">Вернуться к тестам</Link>
      </div>
      {!showReview && test.showAnswersAfterFinish && <p className="test-intro__notice">Правильные ответы появятся после последней доступной попытки. Сейчас их просмотр закрыт.</p>}
      {remaining === 0 && <p className="test-hint">Лимит попыток исчерпан. История останется сохранённой при обновлении страницы.</p>}
    </section>
    <AttemptsTable test={test} state={state} />
    {showReview && <section className="result-review" aria-labelledby="review-title">
      <div className="section-heading"><span className="eyebrow">Проверка ответов</span><h2 id="review-title">Разбор последней попытки</h2><p>Ваши ответы и правильные решения</p></div>
      {result.details.map((detail, index) => <article className="card review-item" key={detail.question.id}>
        <div className="review-item__heading"><div><span className="eyebrow">Вопрос {index + 1}</span><h3>{detail.question.question}</h3></div><span className={`status-pill ${detail.correct ? 'status-pill--success' : 'status-pill--error'}`}>{detail.correct ? '✓ Верно' : '× Ошибка'}</span></div>
        <div className="review-item__answers"><div><span>Ваш ответ</span><p>{answerText(detail.question, last.answers?.[detail.question.id])}</p></div>{!detail.correct && <div><span>Правильный ответ</span><p>{correctAnswerText(detail.question)}</p></div>}</div>
        <small>Баллы: {formatPoints(detail.raw)} из {formatPoints(detail.question.points ?? 1)}</small>
      </article>)}
    </section>}
  </div>
}

function TestContent({ test }) {
  const [session, setSession] = useState(() => readTestState(test))
  const [now, setNow] = useState(Date.now)
  const [error, setError] = useState('')
  const [storageReady] = useState(canPersistTest)

  useEffect(() => {
    const sync = () => { setSession(readTestState(test)); setNow(Date.now()) }
    const onStorage = (event) => { if (event.key === getTestStorageKey(test)) sync() }
    const onVisibility = () => { if (document.visibilityState === 'visible') sync() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', sync); document.removeEventListener('visibilitychange', onVisibility) }
  }, [test])

  // A wall-clock deadline survives reload, route changes and time spent in background tabs.
  useEffect(() => {
    if (!session.active || session.active.deadlineAt === null) return undefined
    const update = () => {
      const timestamp = Date.now()
      setNow(timestamp)
      if (timestamp >= session.active.deadlineAt) setSession(submitTest(test, session.active.id, timestamp))
    }
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [session.active, test])

  const start = () => {
    const response = beginTest(test)
    setSession(response.state)
    setError(response.error ?? '')
    if (!response.error) { setNow(Date.now()); window.scrollTo({ top: 0, behavior: 'auto' }) }
  }
  const change = (questionId, value) => {
    const response = answerTestQuestion(test, session.active.id, questionId, value)
    setSession(response.state)
    setError(response.error ?? '')
  }
  const submit = (event) => {
    event.preventDefault()
    setSession(submitTest(test, session.active.id))
    setError('')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (session.lastResult && !session.active) {
    return <ResultView test={test} state={session} onStart={start} error={error} />
  }

  const remaining = getRemainingAttempts(test, session)
  if (!session.active) return <div className="test-content">
    <Link className="back-link" to="/tests">← Все тесты</Link>
    <section className="card test-intro">
      <div className="test-intro__stripe"><span className="eyebrow">{test.group} / {difficultyLabels[test.difficulty] ?? 'Тест'}</span><span className="status-pill">Проверка знаний</span></div>
      <h1>{test.title}</h1><p className="test-intro__lead">{test.description}</p>
      <div className="test-facts">
        <div><span>Вопросы</span><strong>{test.questions.length}</strong></div>
        <div><span>Время</span><strong>{formatDuration(getTimeLimit(test))}</strong></div>
        <div><span>Попытки</span><strong>{getMaxAttempts(test) === Infinity ? 'Не ограничены' : `${remaining} из ${getMaxAttempts(test)}`}</strong></div>
        <div><span>Для зачёта</span><strong>{getPassingPercent(test)}%</strong></div>
      </div>
      <p className="test-hint">Учитывается {getResultMode(test) === 'best' ? 'лучшая' : 'последняя'} попытка. {getMaxAttempts(test) === Infinity ? 'Ответы доступны после каждого прохождения.' : 'Правильные ответы откроются после последней попытки.'}</p>
      <div className="test-intro__notice"><span aria-hidden="true">ⓘ</span><p>Попытка засчитывается в момент начала. Ответы сохраняются автоматически. Если время истечёт, тест завершится сам.</p></div>
      {error && <p className="test-error" role="alert">{error}</p>}
      {!storageReady && <p className="test-error" role="alert">Браузер запрещает сохранение данных. Разрешите localStorage для этого сайта.</p>}
      <div className="test-actions"><button className="btn btn-primary" type="button" onClick={start} disabled={remaining === 0 || !storageReady}>Начать тест <span aria-hidden="true">→</span></button><Link to="/tests" className="btn btn-outline">К списку тестов</Link></div>
      {remaining === 0 && <p className="test-hint">Лимит попыток исчерпан. Начать тест заново нельзя.</p>}
    </section>
  </div>

  const active = session.active
  const answered = test.questions.filter((q) => q.type === 'checkbox'
    ? active.answers[q.id]?.length > 0 : String(active.answers[q.id] ?? '').trim() !== '').length
  const secondsRemaining = active.deadlineAt === null ? null : Math.max(0, (active.deadlineAt - now) / 1000)
  const progress = test.questions.length ? answered / test.questions.length * 100 : 0

  return <div className="test-content">
    <Link className="back-link" to="/tests">← Все тесты</Link>
    <div className="test-taking-grid">
      <div className="test-taking-main">
        <header className="test-taking-head"><div><span className="eyebrow">{test.group} · Попытка {session.attemptsUsed}</span><h1>{test.title}</h1><p>Отвечайте в удобном темпе. Все изменения сохраняются автоматически.</p></div></header>
        <form className="test-form" onSubmit={submit}>
          {test.questions.map((question, i) => <section className="card test-question" key={question.id} aria-labelledby={`question-${question.id}`}>
            <div className="test-question__head"><span className="test-question__number">{String(i + 1).padStart(2, '0')}</span><div><span className="test-question__type">{question.type === 'radio' ? 'Один ответ' : question.type === 'checkbox' ? 'Несколько ответов' : 'Короткий ответ'}</span><h2 id={`question-${question.id}`}>{question.question}</h2></div><span className="test-question__points">{question.points ?? 1} бал.</span></div>
            <AnswerField question={question} value={active.answers[question.id]} onChange={(value) => change(question.id, value)} />
          </section>)}
          <section className="card test-submit"><div><h2>Готовы завершить?</h2><p>Неотвеченные вопросы будут оценены в 0 баллов.</p></div><button className="btn btn-primary" type="submit">Отправить ответы <span aria-hidden="true">→</span></button></section>
          {error && <p className="test-error" role="alert">{error}</p>}
        </form>
      </div>
      <aside className="card test-sidebar" aria-label="Ход тестирования">
        <div className="test-sidebar__top"><span className="eyebrow">Ваш прогресс</span><strong>{answered} <span>/ {test.questions.length}</span></strong></div>
        <div className="test-sidebar__bar" role="progressbar" aria-label="Заполнено вопросов" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={test.questions.length}><span style={{ width: `${progress}%` }} /></div>
        <p>Вопросов с ответом</p>
        <div className="test-sidebar__divider" />
        <div className={`test-clock ${secondsRemaining !== null && secondsRemaining < 60 ? 'test-clock--urgent' : ''}`}><span>Осталось времени</span><strong role="timer" aria-live="off">{formatDuration(secondsRemaining)}</strong></div>
        <div className="test-sidebar__divider" /><p className="test-sidebar__attempts"><AttemptLabel test={test} state={session} /></p>
        <p className="test-sidebar__saved">✓ Ответы сохраняются</p>
      </aside>
    </div>
  </div>
}

export default function TestPage() {
  const { testSlug } = useParams()
  const test = useMemo(() => getTestBySlug(testSlug), [testSlug])
  if (!test) return <Navigate to="/404" replace />
  return <TestContent test={test} key={test.slug} />
}
