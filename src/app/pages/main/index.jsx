import { Link } from 'react-router-dom'
import '../../styles/css/information-main.css'

export default function MainPage() {
  return (
    <div className="information-home">
      <div className="information-home__inner">
        <section className="information-home__intro">
          <span className="eyebrow">Interactive Platform</span>
          <h1>Учиться, пробовать, понимать.</h1>
          <p>
            Материалы занятий, тесты и полезные инструменты − всё для занятий по веб-разработке в одном месте.
          </p>
          <div className="information-home__actions">
            <Link className="btn btn-primary" to="hhttps://inseliq.github.io/it-cube/courses">Открыть материалы</Link>
            <Link className="btn" to="/tests">Перейти к тестам</Link>
          </div>
        </section>

        <section className="information-cards" aria-label="Возможности платформы">
          <article className="information-card">
            <span>01</span>
            <h2>Материалы уроков</h2>
            <p>Конспекты и полезные ссылки, к которым можно вернуться после занятия.</p>
          </article>
          <article className="information-card">
            <span>02</span>
            <h2>Практика</h2>
            <p>Тесты для закрепления знаний с результатами и разбором ответов.</p>
          </article>
          <article className="information-card">
            <span>03</span>
            <h2>Инструменты</h2>
            <p>Рандомайзер и колесо фортуны для случайного выбора.</p>
            <div className="information-card__links"><Link to="/randomizer">Рандомайзер ↗</Link><Link to="/wheel">Колесо ↗</Link></div>
          </article>
        </section>
      </div>
    </div>
  )
}
