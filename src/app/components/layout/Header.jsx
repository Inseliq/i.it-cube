import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { headerLinks } from '../../data/header-link.map'

const baseUrl = import.meta.env.BASE_URL

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const renderLinks = (className) => headerLinks.map((link) => (
    <NavLink
      key={link.id}
      to={link.path}
      end={link.path === '/'}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) => `${className}${isActive ? ` ${className}--active` : ''}`}
    >
      {link.title}
    </NavLink>
  ))

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="https://inseliq.github.io/it-cube/" className="brand" aria-label="IT-Куб Пенза">
          <img src={`${baseUrl}icons/logo_i.svg`} alt="IT-Куб Пенза" />
        </NavLink>

        <nav className="site-nav" aria-label="Основная навигация">
          {renderLinks('site-nav__link')}
        </nav>

        <div className="header-badge">2026</div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>

      <div
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-menu__backdrop"
          aria-label="Закрыть меню"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />

        <aside className="mobile-menu__panel" id="mobile-navigation" aria-label="Мобильная навигация">
          <div className="mobile-menu__head">
            <NavLink to="/" className="mobile-menu__brand" onClick={() => setMenuOpen(false)}>
              <img src={`${baseUrl}icons/logo.svg`} alt="IT-Куб Пенза" />
            </NavLink>
            <button
              type="button"
              className="mobile-menu__close"
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mobile-menu__nav" aria-label="Навигация">
            {renderLinks('mobile-menu__link')}
          </nav>

          <div className="mobile-menu__footer">
            <span>Interactive Platform</span>
            <b>IT-Cube · 2026</b>
          </div>
        </aside>
      </div>
    </header>
  )
}
