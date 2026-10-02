import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getTestBySlug } from '../../data/tests.map'
import { calculateTestResult } from './test.logic'
import '../../styles/css/test.css'

const difficultyLabels = {
  1: 'Простой',
  2: 'Лёгкий',
  3: 'Средний',
  4: 'Сложный',
  5: 'Контрольный',
}

function formatPoints(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

function QuestionField({ question, value, onChange }) {
  if (question.type === 'input') {
    return (
      <input
        className="test-input"
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Введите ответ"
        autoComplete="off"
      />
    )
  }

  if (question.type === 'radio') {
    return (
      <div className="test-options">
        {question.options.map((option) => (
          <label className="test-option" key={option.id}>
            <input
              type="radio"
              name={question.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="test-option__control" aria-hidden="true" />
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className="test-options">
      {question.options.map((option) => {
        const checked = Array.isArray(value) && value.includes(option.id)
        return (
          <label className="test-option" key={option.id}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                const current = Array.isArray(value) ? value : []
                onChange(
                  checked
                    ? current.filter((item) => item !== option.id)
                    : [...current, option.id],
                )
              }}
            />
            <span className="test-option__control" aria-hidden="true" />
            <span>{option.text}</span>
          </label>
        )
      })}
    </div>
  )
}

function getAnswerText(question, answer) {
  if (question.type === 'input') return answer?.trim() || 'Ответ не дан'

  const ids = question.type === 'radio'
    ? (answer ? [answer] : [])
    : (Array.isArray(answer) ? answer : [])

  if (ids.length === 0) return 'Ответ не дан'

  return ids
    .map((id) => question.options.find((option) => option.id === id)?.text)
    .filter(Boolean)
    .join(', ')
}

function getCorrectAnswerText(question) {
  if (question.type === 'input') return (question.answers ?? []).join(' / ')

  const ids = question.type === 'radio'
    ? [question.correctAnswer]
    : question.correctAnswers

  return (ids ?? [])
    .map((id) => question.options.find((option) => option.id === id)?.text)
    .filter(Boolean)
    .join(', ')
}

function TestResult({ test, result, answers, onRestart }) {
  return (
    <div className="test-result-page">
      <section className="test-result-hero card">
        <div className="test-result-hero__top">
          <div>
            <span className="eyebrow">Тест завершён</span>
            <h1>{test.title}</h1>
            <p>{test.description}</p>
          </div>
          <div className={`test-grade test-grade--${result.grade}`}>
            <span>Оценка</span>
            <strong>{result.grade}</strong>
          </div>
        </div>

        <div className="test-result-stats">
          <div>
            <span>Правильность</span>
            <strong>{result.percent}%</strong>
          </div>
          <div>
            <span>Баллы</span>
            <strong>{formatPoints(result.earnedPoints)} / {formatPoints(result.maxPoints)}</strong>
          </div>
          <div>
            <span>Вопросов</span>
            <strong>{test.questions.length}</strong>
          </div>
        </div>

        <div className="test-result-progress" aria-label={`Результат ${result.percent}%`}>
          <span style={{ width: `${result.percent}%` }} />
        </div>

        <div className="test-result-actions">
          {test.repeat ? (
            <button className="btn btn-primary" type="button" onClick={onRestart}>Пройти ещё раз</button>
          ) : (
            <button className="btn btn-primary disabled" type="button" disabled>Пройти ещё раз</button>
          )}
          <Link className="btn" to="/tests">К списку тестов</Link>
        </div>
      </section>

      {test.showAnswersAfterFinish && (
        <section className="test-review">
          <div className="test-review__heading">
            <span className="eyebrow">Разбор</span>
            <h2>Ответы на вопросы</h2>
            <p>Ниже показано, где была допущена ошибка и какой ответ считается правильным.</p>
          </div>

          <div className="test-review__list">
            {result.details.map((detail, index) => (
              <article
                className={`test-review-card ${detail.correct ? 'test-review-card--correct' : 'test-review-card--wrong'}`}
                key={detail.question.id}
              >
                <div className="test-review-card__number">{index + 1}</div>
                <div className="test-review-card__body">
                  <div className="test-review-card__status">
                    {detail.correct ? 'Верно' : 'Есть ошибка'}
                    <span>{formatPoints(detail.raw)} бал.</span>
                  </div>
                  <h3>{detail.question.question}</h3>
                  <div className="test-review-card__answers">
                    <div>
                      <span>Ваш ответ</span>
                      <p>{getAnswerText(detail.question, answers[detail.question.id])}</p>
                    </div>
                    {!detail.correct && (
                      <div>
                        <span>Правильный ответ</span>
                        <p>{getCorrectAnswerText(detail.question)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default function TestPage() {
  const { testSlug } = useParams()
  const test = useMemo(() => getTestBySlug(testSlug), [testSlug])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  if (!test) return <Navigate to="/404" replace />

  const answeredCount = test.questions.filter((question) => {
    const value = answers[question.id]
    if (question.type === 'checkbox') return Array.isArray(value) && value.length > 0
    return String(value ?? '').trim().length > 0
  }).length

  const handleAnswer = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setResult(calculateTestResult(test, answers))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRestart = () => {
    setAnswers({})
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    return (
      <div className="page-shell test-page">
        <TestResult test={test} result={result} answers={answers} onRestart={handleRestart} />
      </div>
    )
  }

  return (
    <div className="page-shell test-page">
      <Link className="test-back" to="/tests">↶ Все тесты</Link>

      <header className="test-hero card">
        <div>
          <span className="eyebrow">{test.group} · {difficultyLabels[test.difficulty]}</span>
          <h1>{test.title}</h1>
          <p>{test.description}</p>
        </div>
        <div className="test-hero__counter">
          <span>Заполнено</span>
          <strong>{answeredCount}/{test.questions.length}</strong>
        </div>
      </header>

      <form className="test-form" onSubmit={handleSubmit}>
        {test.questions.map((question, index) => (
          <section className="test-question card" key={question.id}>
            <div className="test-question__head">
              <span className="test-question__number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="test-question__type">
                  {question.type === 'input' && 'Введите ответ'}
                  {question.type === 'radio' && 'Один вариант'}
                  {question.type === 'checkbox' && 'Несколько вариантов'}
                </span>
                <h2>{question.question}</h2>
              </div>
              <span className="test-question__points">до {question.points ?? 1} бал.</span>
            </div>

            <QuestionField
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
            />
          </section>
        ))}

        <div className="test-submit card">
          <div>
            <strong>Готовы завершить тест?</strong>
            <span>Можно отправить результат даже если заполнены не все вопросы.</span>
          </div>
          <button className="btn btn-primary" type="submit">Завершить тест</button>
        </div>
      </form>
    </div>
  )
}
