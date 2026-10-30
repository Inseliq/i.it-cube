import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './app/components/layout/Layout'
import MainPage from './app/pages/main'
import TestsPage from './app/pages/tests'
import TestPage from './app/pages/test'
import RandomizerPage from './app/pages/randomizer'
import WheelPage from './app/pages/wheel'
import ErrorPage from './app/pages/error/error'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/test" element={<Navigate to="/tests" replace />} />
        <Route path="/test/:testSlug" element={<TestPage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
        <Route path="/wheel" element={<WheelPage />} />
      </Route>

      <Route path="/404" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
