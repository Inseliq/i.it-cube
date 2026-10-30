import { useRef, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  getColloquiumForYear,
  getQuestionsForVariant,
  getVisibleColloquiums,
  getCardOffset,
  parseColloquiumCode,
  wrapQuestionIndex,
} from '../../utils/colloquium'
import '../../styles/css/colloquium.css'

function QuestionArtwork({ image }) {
  // Изображение необязательно. Для пустого image используется встроенная графика.
  return image ? (
    <img className="colloquium-card__image" src={/^https?:\/\//i.test(image) ? image : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`} alt="" loading="lazy" />
  ) : (
    <></>
  )
}

function ColloquiumDeck({ code, questions, onBack }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStart = useRef(null)
  const lastSwipeAt = useRef(0)
  const length = questions.length
  const go = (step) => setActiveIndex((previous) => wrapQuestionIndex(previous + step, length))
  const goTo = (index) => setActiveIndex(wrapQuestionIndex(index, length))

  const onTouchStart = (event) => {
    const touch = event.changedTouches?.[0]
    if (!touch) return
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event) => {
    if (!touchStart.current) return
    const touch = event.changedTouches?.[0]
    const start = touchStart.current
    touchStart.current = null
    if (!touch) return
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    // Телефон — вертикальный жест, компьютер/планшет — горизонтальный.
    const vertical = window.matchMedia('(max-width: 640px)').matches
    const primary = vertical ? dy : dx
    const cross = vertical ? dx : dy
    if (Math.abs(primary) > 42 && Math.abs(primary) > Math.abs(cross) * 1.2) {
      lastSwipeAt.current = Date.now()
      go(primary < 0 ? 1 : -1)
    }
  }

  return (
    <section className="colloquium-session" aria-label={`Вопросы варианта ${code}`}>
      <div className="colloquium-session__header">
        <div>
          <span className="eyebrow">Коллоквиум · вариант {code}</span>
          <h1>Карточки с вопросами</h1>
          <p>Выбери карточку. На телефоне листай вверх или вниз — после последнего вопроса будет первый.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onBack}>Изменить вариант</button>
      </div>

      <div className="colloquium-deck-shell">
        <div
          className="colloquium-deck"
          role="group"
          aria-label="Перелистывание вопросов"
          tabIndex={0}
          onKeyDown={(event) => {
            if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
              event.preventDefault()
              go(1)
            } else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
              event.preventDefault()
              go(-1)
            }
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {questions.map((item, index) => {
            const offset = getCardOffset(index, activeIndex, length)
            if (Math.abs(offset) > 2) return null
            const isCurrent = index === activeIndex
            return (
              <button
                type="button"
                className={`colloquium-card ${isCurrent ? 'colloquium-card--active' : ''}`}
                key={item.id}
                style={{ '--offset': offset, '--magnitude': Math.abs(offset), zIndex: 10 - Math.abs(offset) }}
                aria-label={`Перейти к вопросу ${index + 1} из ${length}`}
                aria-current={isCurrent ? 'step' : undefined}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => {
                  // Подавляем синтетический click после свайпа, иначе он отменит перелистывание.
                  if (Date.now() - lastSwipeAt.current < 450) return
                  if (!isCurrent) goTo(index)
                }}
              >
                <QuestionArtwork image={item.image} />
                <span className="colloquium-card__number">Вопрос {index + 1}</span>
                <span className="colloquium-card__question">{item.question}</span>
              </button>
            )
          })}
        </div>
        <p className="colloquium-deck__help">На телефоне — свайп ↑ ↓ · На компьютере — стрелки или карточки</p>
      </div>

      <div className="colloquium-session__controls">
        <button type="button" className="colloquium-control" onClick={() => go(-1)} aria-label="Предыдущий вопрос">← <span>Назад</span></button>
        <span className="colloquium-session__counter" aria-live="polite">{activeIndex + 1} / {length}</span>
        <button type="button" className="colloquium-control" onClick={() => go(1)} aria-label="Следующий вопрос"><span>Далее</span> →</button>
      </div>
    </section>
  )
}

export default function ColloquiumPage() {
  const [searchParams] = useSearchParams()
  const yearValue = searchParams.get('group')
  const requestedYear = yearValue === '1' || yearValue === '2' ? Number(yearValue) : null
  const [entry, setEntry] = useState('')
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const visible = getVisibleColloquiums()
  const selectedConfig = requestedYear ? getColloquiumForYear(requestedYear) : null
  const hasActive = visible.some((group) => group.active)

  // Скрытый коллоквиум нельзя открыть даже напрямую по URL.
  if (!visible.length || (yearValue && (!requestedYear || !selectedConfig?.visible))) {
    return <Navigate to="/tests" replace />
  }

  // Неактивный коллоквиум остаётся доступным по прямому URL только как уведомление.
  if ((selectedConfig && !selectedConfig.active) || (!requestedYear && !hasActive)) {
    return <div className="page-shell colloquium-page">
      <Link to="/tests" className="colloquium-back">← К списку тестов</Link>
      <section className="card colloquium-notice" role="status">
        <span className="colloquium-notice__icon" aria-hidden="true">◷</span>
        <span className="eyebrow">Коллоквиум</span>
        <h1>Коллоквиум пока не доступен</h1>
        <p>Преподаватель откроет доступ позднее. Вернитесь к списку тестов.</p>
        <Link to="/tests" className="btn btn-primary">К тестам</Link>
      </section>
    </div>
  }

  const submit = (event) => {
    event.preventDefault()
    const value = parseColloquiumCode(entry)
    if (!value) {
      setError('Введите вариант в формате 1-8 или 2-7: год обучения, дефис, номер варианта.')
      return
    }
    if (requestedYear && value.year !== requestedYear) {
      setError(`Это коллоквиум ${requestedYear}-го курса. Введите вариант ${requestedYear}-... или откройте карточку другой группы.`)
      return
    }
    const config = getColloquiumForYear(value.year)
    if (!config?.visible) {
      setError('Коллоквиум для этой группы скрыт.')
      return
    }
    if (!config.active) {
      setError('Коллоквиум пока не доступен для указанного курса.')
      return
    }
    const result = getQuestionsForVariant(value.year, value.variant)
    if (result.error) {
      setError(result.error)
      return
    }
    setError('')
    setSelected({ code: value.code, questions: result.questions })
  }

  return (
    <div className="page-shell colloquium-page">
      <Link to="/tests" className="colloquium-back">← К списку тестов</Link>
      {selected ? (
        <ColloquiumDeck key={selected.code} code={selected.code} questions={selected.questions} onBack={() => { setSelected(null); setError('') }} />
      ) : (
        <section className="colloquium-start card">
          <div className="colloquium-start__eyebrow"><span className="eyebrow">Устный опрос</span><span className="colloquium-start__step">Этап 1 из 2</span></div>
          <h1>Коллоквиум</h1>
          <p className="colloquium-start__intro">Введите вариант, который выдал преподаватель. После этого откроются карточки с вопросами.</p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="colloquium-code">Ваш вариант</label>
            <input
              id="colloquium-code"
              name="variant"
              placeholder={requestedYear === 2 ? '2-7' : '1-8'}
              inputMode="text"
              autoComplete="off"
              maxLength={32}
              value={entry}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'colloquium-error' : 'colloquium-hint'}
              onChange={(event) => { setEntry(event.target.value); setError('') }}
            />
            <small id="colloquium-hint">1-8 — первый курс, вариант 8. 2-7 — второй курс, вариант 7.</small>
            {error && <p id="colloquium-error" className="colloquium-start__error" role="alert">{error}</p>}
            <button className="btn btn-primary" type="submit">Открыть вопросы <span aria-hidden="true">→</span></button>
          </form>
          <div className="colloquium-start__bottom"><span>01</span><span>Ввод варианта</span><span>02</span><span>Карточки вопросов</span></div>
        </section>
      )}
    </div>
  )
}
