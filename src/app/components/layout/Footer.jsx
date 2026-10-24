import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="site-footer"><div className="site-footer__inner">
    <p className="site-footer__copyright">© 2026 · IT-Куб Пенза</p>
    <Link className="site-footer__docs" to="/information">Учебные материалы</Link>
    <p className="site-footer__rights">Интерактивная образовательная платформа</p>
  </div></footer>
}
