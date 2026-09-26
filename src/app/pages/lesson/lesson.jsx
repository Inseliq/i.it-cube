import { Navigate } from 'react-router-dom'

import LessonAttachments
  from '../../components/lesson/LessonAttachments'

import {
  parseMarkdown,
} from '../../utils/parseMarkdown'

import {
  useLessonPage,
} from './lesson.fun'

export default function LessonPage() {
  const {
    exists,
    lessonInfo,
    lesson,
    presentationUrl,
    presentationName,
  } = useLessonPage()

  if (!exists) {
    return (
      <Navigate
        to="/404"
        replace
      />
    )
  }

  return (
    <>
      <LessonAttachments
        lessonSlug={lessonInfo.slug}
        presentationUrl={presentationUrl}
        presentationName={presentationName}
        referenceUrl={lessonInfo.reference}
      />

      <article>
        {parseMarkdown(
          lesson.content,
        )}
      </article>

      <LessonAttachments
        lessonSlug={lessonInfo.slug}
        presentationUrl={presentationUrl}
        presentationName={presentationName}
        referenceUrl={lessonInfo.reference}
      />
    </>
  )
}