import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Layout from './app/components/layout/Layout'

import LessonPage from './app/pages/lesson/lesson'
import DownloadPage from './app/pages/download/download'
import ErrorPage from './app/pages/error/error'

export default function App() {
  return (
    <Routes>

      {/* Страницы с общим Layout */}
      <Route element={<Layout />}>

        <Route
          path="/information/:lessonSlug"
          element={<LessonPage />}
        />

      </Route>

      {/* ErrorPage специально находится вне Layout */}
      <Route
        path="/404"
        element={<ErrorPage />}
      />

      <Route
        path="/download/:lessonSlug"
        element={<DownloadPage />}
      />

      {/* Любой неизвестный URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/404"
            replace
          />
        }
      />

    </Routes>
  )
}