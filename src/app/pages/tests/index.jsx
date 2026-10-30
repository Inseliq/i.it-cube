import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { testGroups } from '../../data/tests.map'
import { formatDuration, getCreditedAttempt, getMaxAttempts, getRemainingAttempts, getTimeLimit, readTestState } from '../../utils/testSession'
import '../../styles/css/tests.css'

const difficultyLabels = { 1: 'Простой', 2: 'Лёгкий', 3: 'Средний', 4: 'Сложный', 5: 'Контрольный' }

function ColloquiumTile({ test }) {
  return <article className="card quiz-tile quiz-tile--colloquium">
    <div className="quiz-tile__top">
      <span className="quiz-tile__difficulty">{difficultyLabels[test.difficulty] ?? 'Коллоквиум'}</span>
      <span className={`status-pill ${test.active ? 'status-pill--active' : ''}`}>
        {test.active ? 'Доступен' : 'Недоступен'}
      </span>
    </div>
    <h3>{test.title}</h3>
    <p>{test.description}</p>
    <div className="quiz-tile__facts"><span>Устный формат</span><span>Вопросы по вариантам</span></div>
    {test.active ? <Link className="quiz-tile__action quiz-tile__action--link" to={`${test.path}?group=${test.year}`}>
      <span>Открыть коллоквиум</span><span aria-hidden="true">↗</span>
    </Link> : <div className="quiz-tile__action">
      <button type="button" className="quiz-tile__disabled" disabled>Пока не доступен</button>
      <span aria-hidden="true">⌛</span>
    </div>}
  </article>
}

function RegularTestTile({ test }) {
  const [progress, setProgress] = useState(() => readTestState(test))
  useEffect(() => {
    const sync = () => setProgress(readTestState(test))
    const visible = () => { if (document.visibilityState === 'visible') sync() }
    window.addEventListener('focus', sync)
    window.addEventListener('storage', sync)
    document.addEventListener('visibilitychange', visible)
    return () => { window.removeEventListener('focus', sync); window.removeEventListener('storage', sync); document.removeEventListener('visibilitychange', visible) }
  }, [test])
  const remaining = getRemainingAttempts(test, progress)
  const credited = getCreditedAttempt(test, progress)
  const status = progress.active ? 'Продолжить' : progress.lastResult ? 'Результат' : remaining === 0 ? 'Закрыт' : 'Начать тест'
  return <Link className="card quiz-tile" to={test.path}>
    <div className="quiz-tile__top"><span className="quiz-tile__difficulty">{difficultyLabels[test.difficulty] ?? 'Тест'}</span><span className={`status-pill ${progress.active ? 'status-pill--active' : progress.lastResult ? (credited?.passed ? 'status-pill--success' : 'status-pill--error') : ''}`}>{progress.active ? 'В процессе' : progress.lastResult ? (credited?.passed ? 'Зачтён' : 'Не зачтён') : 'Доступен'}</span></div>
    <h3>{test.title}</h3><p>{test.description}</p>
    {credited && <p className="quiz-tile__credited">Зачётный результат: <strong>{credited.percent}% · оценка {credited.grade}</strong></p>}
    <div className="quiz-tile__facts"><span>☷ {test.questions.length} вопросов</span><span>◷ {formatDuration(getTimeLimit(test))}</span><span>↻ {getMaxAttempts(test) === Infinity ? 'Без лимита' : `${remaining} попыт. осталось`}</span></div>
    <div className="quiz-tile__action"><span>{status}</span><span aria-hidden="true">↗</span></div>
  </Link>
}

function TestTile({ test }) {
  return test.type === 'colloquium' ? <ColloquiumTile test={test} /> : <RegularTestTile test={test} />
}

export default function TestsPage() {
  return <div className="page-shell tests-page">
    <header className="section-heading tests-page__hero"><span className="eyebrow">Практика / тестирование</span><h1 className="page-title">Проверь свои знания</h1><p className="page-lead">Выбери тест из своей группы. Прогресс, количество попыток и результаты сохраняются в этом браузере.</p></header>
    <div className="test-groups">{testGroups.map((group) => {
      const available = group.tests.filter((test) => test.visible)
      return <section className="test-group" key={group.id}>
        <div className="test-group__head"><div><span className="eyebrow">Учебная группа</span><h2>{group.title}</h2><p>{group.description}</p></div><span className="test-group__count">{available.length} {available.length === 1 ? 'тест' : available.length < 5 ? 'теста' : 'тестов'}</span></div>
        {available.length ? <div className="test-grid">{available.map((test) => <TestTile test={test} key={test.id} />)}</div> : <p>Пока нет доступных тестов.</p>}
      </section>
    })}</div>
  </div>
}
