import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Интерактивная платформа − IT-Cube',
  '/tests': 'Тесты − IT-Cube',
  '/randomizer': 'Рандомайзер − IT-Cube',
  '/wheel': 'Колесо фортуны − IT-Cube',
}

export function usePageTitle() {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname

    if (pathname.startsWith('/information/')) {
      document.title = 'Интерактивный материал − IT-Cube'
      return
    }

    if (pathname.startsWith('/test/')) {
      document.title = 'Тест − IT-Cube'
      return
    }

    document.title = pageTitles[pathname] ?? 'Interactive Platform − IT-Cube'
  }, [location.pathname])
}
