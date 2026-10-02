import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../../data/courses.map'
import '../../styles/css/information.css'

export default function InformationPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? null)
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? courses[0]

  return (
    <div className="page-shell information-page">
      <header className="information-page__hero">
        <span className="eyebrow">Справочные материалы</span>
        <h1 className="page-title">Все материалы</h1>
        <p className="page-lead">
          Сначала выберите учебную группу, затем откройте нужный интерактивный материал.
        </p>
      </header>

      <div className="information-course-picker" aria-label="Выбор учебной группы">
        {courses.map((course) => (
          <button
            type="button"
            className={`information-course-choice card ${selectedCourse?.id === course.id ? 'information-course-choice--active' : ''}`}
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            aria-pressed={selectedCourse?.id === course.id}
          >
            <span>{course.level}</span>
            <strong>{course.code}</strong>
            <p>{course.description}</p>
            <small>{course.lessons.length} {course.lessons.length === 1 ? 'материал' : 'материала'}</small>
          </button>
        ))}
      </div>

      {selectedCourse && (
        <section className="information-group card">
          <div className="information-group__head">
            <div>
              <span className="information-group__level">Выбрана группа</span>
              <h2>{selectedCourse.code}</h2>
              <p>{selectedCourse.description}</p>
            </div>
          </div>

          <div className="information-materials">
            {selectedCourse.lessons.map((lesson) => (
              <Link className="information-material" to={lesson.path} key={lesson.id}>
                <div>
                  <span>Материал</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                </div>
                <span className="information-material__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
