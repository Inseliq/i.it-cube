import { Link } from 'react-router-dom'
import { testGroups } from '../../data/tests.map'
import '../../styles/css/tests.css'

const difficultyLabels = {
  1: 'Простой',
  2: 'Лёгкий',
  3: 'Средний',
  4: 'Сложный',
  5: 'Контрольный',
}

export default function TestsPage() {
  return (
    <div className="page-shell tests-page">
      <header className="tests-page__hero">
        <span className="eyebrow">Проверка знаний</span>
        <h1 className="page-title">Доступные тесты</h1>
        <p className="page-lead">
          Выберите свою группу и тест. После завершения вы увидите итоговую оценку,
          процент правильных ответов и, если это разрешено в настройках теста, подробный разбор.
        </p>
      </header>

      <div className="test-groups">
        {testGroups.map((group) => {
          const visibleTests = group.tests.filter((test) => test.visible)

          return (
            <section className="test-group card" key={group.id}>
              <div className="test-group__head">
                <div>
                  <span>{group.group}</span>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                <div className="test-group__count">{visibleTests.length} тест.</div>
              </div>

              {visibleTests.length > 0 ? (
                <div className="test-grid">
                  {visibleTests.map((test) => (
                    <Link className="test-card" to={test.path} key={test.id}>
                      <div className="test-card__meta">
                        <span>{test.questions.length} вопроса</span>
                        <span>Сложность: {difficultyLabels[test.difficulty] ?? test.difficulty}</span>
                      </div>
                      <h3>{test.title}</h3>
                      <p>{test.description}</p>
                      <span className="test-card__action">Начать тест <b>→</b></span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="test-group__empty">Для этой группы пока нет открытых тестов.</div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
