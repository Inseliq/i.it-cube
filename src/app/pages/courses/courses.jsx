import { Link } from 'react-router-dom'

import { useCoursesPage } from './courses.fun'

export default function CoursesPage() {
  const {
    courses,
  } = useCoursesPage()

  return (
    <>
      <h1>это страница курсов</h1>

      {courses.map((course) => (
        <section key={course.id}>

          <h2>
            {course.title}
          </h2>

          <p>
            {course.description}
          </p>

          <div>
            {course.lessons.map((lesson) => (
              <article key={lesson.id}>

                <h3>
                  {lesson.title}
                </h3>

                <p>
                  {lesson.description}
                </p>

                <Link to={lesson.path}>
                  Перейти к уроку
                </Link>

              </article>
            ))}
          </div>

        </section>
      ))}
    </>
  )
}