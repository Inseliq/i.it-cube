import { Outlet } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

import { usePageTitle } from '../../utils/usePageTitle'

export default function Layout() {
  usePageTitle()

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}