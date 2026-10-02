import { Link } from 'react-router-dom'
import '../../styles/css/information-main.css'

export default function MainPage() {
  return (
    <div className="information-home">
      <div className="information-home__inner">
        <section className="information-home__intro">
          <span className="eyebrow">Interactive Platform</span>
          <h1>Интерактивные материалы IT-Cube</h1>
          <p>
            Платформа для интерактивных учебных материалов, подсказок, тестов и дополнительных
            элементов занятий.
          </p>
          <div className="information-home__actions">
            <Link className="btn btn-primary" to="/information">Информация</Link>
            <Link className="btn" to="/tests">Тесты</Link>
          </div>
        </section>

        <section className="information-cards" aria-label="Возможности платформы">
          <article className="information-card">
            <span>01</span>
            <h2>Материалы уроков</h2>
            <p>Отдельные интерактивные страницы можно будет открывать по адресу /information/...</p>
          </article>
          <article className="information-card">
            <span>02</span>
            <h2>Практика</h2>
            <p>Здесь можно размещать тренажёры, задания, подсказки и небольшие учебные активности.</p>
          </article>
          <article className="information-card">
            <span>03</span>
            <h2>Единая экосистема</h2>
            <p>Платформа дополняет основной сайт IT-Cube и образовательный дневник.</p>
          </article>
        </section>
      </div>
    </div>
  )
}
