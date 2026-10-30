import { colloquiumMap } from '../data/colloquium.map.js'

export const MAX_COLLOQUIUM_QUESTIONS = 12
export const MAX_COLLOQUIUM_QUESTION_LENGTH = 200

// visible=false всегда выключает active независимо от конфигурации.
export function getColloquiumForYear(year) {
  const config = colloquiumMap[Number(year)]
  if (!config) return null
  return { ...config, year: Number(year), active: Boolean(config.visible && config.active) }
}

export function getVisibleColloquiums() {
  return [1, 2].map(getColloquiumForYear).filter((entry) => entry?.visible)
}

export function getColloquiumCardForYear(year) {
  const config = getColloquiumForYear(year)
  if (!config) return null
  return {
    id: `${config.id}-${year}`,
    type: 'colloquium',
    path: config.path,
    title: config.title,
    description: config.description,
    visible: Boolean(config.visible),
    active: config.active,
    difficulty: config.difficulty,
    year: config.year,
  }
}

export function parseColloquiumCode(value) {
  const normalized = String(value).trim()
  const match = /^([12])\s*-\s*([1-9]\d*)$/.exec(normalized)
  if (!match) return null
  const year = Number(match[1])
  const variant = Number(match[2])
  if (!Number.isSafeInteger(variant)) return null
  return { year, variant, code: `${year}-${variant}` }
}

// Возвращаем понятную ошибку настройки вместо тихого обрезания данных.
export function validateVariantQuestions(rawQuestions) {
  if (!Array.isArray(rawQuestions) || rawQuestions.length < 1 || rawQuestions.length > MAX_COLLOQUIUM_QUESTIONS) {
    return { questions: [], error: `В варианте должно быть от 1 до ${MAX_COLLOQUIUM_QUESTIONS} вопросов.` }
  }
  const questions = []
  for (let i = 0; i < rawQuestions.length; i += 1) {
    const item = rawQuestions[i]
    const question = (typeof item === 'string' ? item : item?.question)
    if (typeof question !== 'string' || !question.trim() || question.length > MAX_COLLOQUIUM_QUESTION_LENGTH) {
      return { questions: [], error: `Вопрос ${i + 1}: требуется текст от 1 до ${MAX_COLLOQUIUM_QUESTION_LENGTH} символов.` }
    }
    questions.push({ id: `question-${i + 1}`, question: question.trim(), image: typeof item === 'object' && typeof item.image === 'string' ? item.image : '' })
  }
  return { questions, error: '' }
}

export function getQuestionsForVariant(year, variant) {
  const config = getColloquiumForYear(year)
  if (!config?.visible) return { questions: [], error: 'Коллоквиум для этой группы недоступен.' }
  if (!config.active) return { questions: [], error: 'Коллоквиум пока не доступен.' }
  const raw = config.variants?.[variant]
  if (raw == null) return { questions: [], error: `Вариант ${year}-${variant} пока не добавлен. Уточните номер у преподавателя.` }
  return validateVariantQuestions(raw)
}

// Кольцевая навигация: следующий от последнего — первый.
export function wrapQuestionIndex(index, count) {
  if (!Number.isInteger(count) || count < 1) return 0
  return ((index % count) + count) % count
}

// -2, -1, 0, 1, 2 — карточки вокруг активной позиции.
export function getCardOffset(index, current, count) {
  const distance = wrapQuestionIndex(index - current, count)
  return distance > Math.floor(count / 2) ? distance - count : distance
}
