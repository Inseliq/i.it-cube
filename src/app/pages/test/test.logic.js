export function normalizeInput(value = '') {
  return String(value)
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»„“”"'`]/g, '')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
}

function scoreInput(question, answer) {
  const normalizedAnswer = normalizeInput(answer)
  const acceptedAnswers = (question.answers ?? []).map(normalizeInput)
  const correct = Boolean(normalizedAnswer) && acceptedAnswers.includes(normalizedAnswer)

  return {
    raw: correct ? (question.points ?? 2) : 0,
    normalized: correct ? 1 : 0,
    correct,
  }
}

function scoreRadio(question, answer) {
  const correct = answer === question.correctAnswer

  return {
    raw: correct ? (question.points ?? 1) : 0,
    normalized: correct ? 1 : 0,
    correct,
  }
}

function scoreCheckbox(question, answer = []) {
  const selected = new Set(Array.isArray(answer) ? answer : [])
  const correctAnswers = new Set(question.correctAnswers ?? [])
  const options = question.options ?? []

  if (options.length === 0) {
    return { raw: 0, normalized: 0, correct: false }
  }

  // Для 4 вариантов: правильное решение по варианту +0.25, ошибка -0.5.
  // Для 6/8 вариантов коэффициенты автоматически становятся 1/6 и -2/6,
  // либо 1/8 и -2/8. Максимум за checkbox — 1, минимум — 0.
  const reward = 1 / options.length
  const penalty = 2 / options.length

  let normalized = 0

  options.forEach((option) => {
    const shouldBeSelected = correctAnswers.has(option.id)
    const isSelected = selected.has(option.id)
    normalized += shouldBeSelected === isSelected ? reward : -penalty
  })

  normalized = Math.max(0, Math.min(1, normalized))

  const correct = options.every((option) =>
    selected.has(option.id) === correctAnswers.has(option.id),
  )

  return {
    raw: normalized * (question.points ?? 1),
    normalized,
    correct,
  }
}

export function scoreQuestion(question, answer) {
  if (question.type === 'input') return scoreInput(question, answer)
  if (question.type === 'radio') return scoreRadio(question, answer)
  if (question.type === 'checkbox') return scoreCheckbox(question, answer)
  return { raw: 0, normalized: 0, correct: false }
}

export function getGrade(percent) {
  if (percent >= 85) return 5
  if (percent >= 75) return 4
  if (percent >= 45) return 3
  return 2
}

export function calculateTestResult(test, answers) {
  const details = test.questions.map((question) => ({
    question,
    answer: answers[question.id],
    ...scoreQuestion(question, answers[question.id]),
  }))

  const earnedPoints = details.reduce((sum, item) => sum + item.raw, 0)
  const maxPoints = test.questions.reduce((sum, question) => sum + (question.points ?? 1), 0)
  const normalizedTotal = details.reduce((sum, item) => sum + item.normalized, 0)
  const percent = test.questions.length
    ? Math.round((normalizedTotal / test.questions.length) * 100)
    : 0

  return {
    earnedPoints,
    maxPoints,
    percent,
    grade: getGrade(percent),
    details,
  }
}
