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
            Материалы занятий, практика и тесты — всё для изучения веб-разработки в одном месте.
          </p>
          <div className="information-home__actions">
            <Link className="btn btn-primary" to="/information">Открыть материалы</Link>
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
            <h2>В своём темпе</h2>
            <p>Начинайте с простого, сохраняйте прогресс и продолжайте обучение.</p>
          </article>
        </section>
      </div>
    </div>
  )
}
