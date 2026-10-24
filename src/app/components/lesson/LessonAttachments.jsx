import { Link } from 'react-router-dom'
function isInternalUrl(url) { return url?.startsWith('/') && !url.startsWith('//') }
export default function LessonAttachments({ lessonSlug, presentationUrl, referenceUrl }) {
  const baseUrl = import.meta.env.BASE_URL; if (!presentationUrl && !referenceUrl) return null;
  return <section className="lesson-attachments card">
    <div>
      <span className="eyebrow">Материалы</span>
      <h2>Вложения</h2>
    </div>
    <div className="lesson-attachments__links">
      {presentationUrl && <a title='Скачать презентацию' className="card presentation" href={`${baseUrl}download/${lessonSlug}`} target="_blank" rel="noopener noreferrer">
        <img src={`${baseUrl}icons/card_presentation.svg`} alt="" />
        {lessonSlug}.pptx
      </a>}
      {referenceUrl && (isInternalUrl(referenceUrl)
        ? <Link title='Открыть информационную справку' className="card information" to={referenceUrl}>
          <img src={`${baseUrl}icons/card_information.svg`} alt="" />
          Справка
        </Link>
        : <a title='Открыть информационную справку' className="card information" href={referenceUrl} target="_blank" rel="noreferrer">
          <img src={`${baseUrl}icons/card_information.svg`} alt="" />
          Справка
        </a>)}
    </div>
  </section>
}
