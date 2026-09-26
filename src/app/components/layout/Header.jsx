import { NavLink } from 'react-router-dom'

import { headerLinks } from '../../data/header-link.map'

export default function Header() {
  return (
    <header>
      <nav>
        {headerLinks.map((link) => (
          <NavLink key={link.id} to={link.path}>
            {link.title}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}