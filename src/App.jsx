import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './app/components/layout/Layout'
import MainPage from './app/pages/main'
import InformationPage from './app/pages/information'
import LessonPage from './app/pages/lesson/lesson'
import TestsPage from './app/pages/tests'
import TestPage from './app/pages/test'
import DownloadPage from './app/pages/download/download'
import ErrorPage from './app/pages/error/error'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/information/:lessonSlug" element={<LessonPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/test" element={<Navigate to="/tests" replace />} />
        <Route path="/test/:testSlug" element={<TestPage />} />
      </Route>

      <Route path="/404" element={<ErrorPage />} />
      <Route path="/download/:lessonSlug" element={<DownloadPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
