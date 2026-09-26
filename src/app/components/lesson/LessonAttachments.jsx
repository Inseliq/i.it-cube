import { Link } from 'react-router-dom'

function isInternalUrl(url) {
  return (
    url?.startsWith('/') &&
    !url.startsWith('//')
  )
}

export default function LessonAttachments({
  lessonSlug,
  presentationUrl,
  presentationName,
  referenceUrl,
}) {
  return (
    <section>
      <h2>Вложения</h2>

      {presentationUrl && (
        <a
          href={`/download/${lessonSlug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Скачать презентацию
        </a>
      )}

      {referenceUrl && (
        <>
          {' '}

          {isInternalUrl(referenceUrl) ? (
            <Link to={referenceUrl}>
              Информационная справка
            </Link>
          ) : (
            <a
              href={referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Информационная справка
            </a>
          )}
        </>
      )}
    </section>
  )
}