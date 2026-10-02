import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Interactive Platform — IT-Cube',
  '/information': 'Информация — IT-Cube',
  '/tests': 'Тесты — IT-Cube',
}

export function usePageTitle() {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname

    if (pathname.startsWith('/information/')) {
      document.title = 'Интерактивный материал — IT-Cube'
      return
    }

    if (pathname.startsWith('/test/')) {
      document.title = 'Тест — IT-Cube'
      return
    }

    document.title = pageTitles[pathname] ?? 'Interactive Platform — IT-Cube'
  }, [location.pathname])
}
