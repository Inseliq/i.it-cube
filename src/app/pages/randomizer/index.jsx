import { useState } from 'react'
import { generateNumbers, MAX_SAFE, parseNumberList, parseSafeNumber } from '../../utils/randomTools'
import '../../styles/css/tools.css'

export default function RandomizerPage() {
  const [source, setSource] = useState('range')
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('10')
  const [list, setList] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')
  const [excluded, setExcluded] = useState('')
  const [count, setCount] = useState('1')
  const [unique, setUnique] = useState(true)
  const [result, setResult] = useState([])
  const [error, setError] = useState('')

  const amountLimit = (() => {
    try {
      if (source === 'list') return Math.min(200, new Set(parseNumberList(list, 'Список')).size || 1)
      return Math.min(200, Math.max(1, parseSafeNumber(max, 'До') - parseSafeNumber(min, 'От') + 1))
    } catch { return 200 }
  })()

  function generate(event) {
    event.preventDefault()
    try {
      const output = generateNumbers({
        source, min: source === 'range' ? parseSafeNumber(min, 'От') : 0,
        max: source === 'range' ? parseSafeNumber(max, 'До') : 0,
        list: source === 'list' ? parseNumberList(list, 'Список') : [],
        excluded: parseNumberList(excluded, 'Исключения'),
        count: parseSafeNumber(count, 'Количество'), unique: unique && Number(count) > 1,
      })
      setResult(output)
      setError('')
    } catch (cause) { setError(cause.message); setResult([]) }
  }

  return <div className="page-shell tool-page">
    <header className="tool-hero"><span className="eyebrow">Инструменты / случайный выбор</span><h1 className="page-title">Рандомайзер</h1><p className="page-lead">Сгенерируйте одно или несколько случайных чисел из диапазона или своего списка.</p></header>
    <div className="tool-grid">
      <form className="card tool-settings" onSubmit={generate}>
        <div className="tool-panel-heading"><h2>Настройки</h2><span>01</span></div>
        <fieldset className="tool-fieldset"><legend>Источник чисел</legend><div className="tool-toggle-group">
          <label className={source === 'range' ? 'tool-toggle tool-toggle--active' : 'tool-toggle'}><input type="radio" name="source" checked={source === 'range'} onChange={() => setSource('range')} />Диапазон</label>
          <label className={source === 'list' ? 'tool-toggle tool-toggle--active' : 'tool-toggle'}><input type="radio" name="source" checked={source === 'list'} onChange={() => setSource('list')} />Список</label>
        </div></fieldset>
        {source === 'range' ? <div className="tool-two-columns"><label className="tool-field">От<input inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} aria-label="Начало диапазона" /></label><label className="tool-field">До<input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} aria-label="Конец диапазона" /></label></div>
          : <label className="tool-field">Числа через запятую<textarea rows={5} value={list} onChange={(e) => setList(e.target.value)} placeholder="1, 2, 3, 4" /><small>Можно также перечислять через новую строку</small></label>}
        <label className="tool-field">Количество чисел<input type="number" min="1" max={unique ? amountLimit : 200} value={count} onChange={(e) => setCount(e.target.value)} /><small>От 1 до {unique ? amountLimit : 200} чисел за одну генерацию</small></label>
        <label className="tool-field">Исключить числа<textarea rows={2} value={excluded} onChange={(e) => setExcluded(e.target.value)} placeholder="Например: 3, 7" /></label>
        <label className={`tool-checkbox ${Number(count) <= 1 ? 'tool-checkbox--disabled' : ''}`}><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} disabled={Number(count) <= 1} /><span><strong>Без повторений</strong><small>Каждое число выпадет не больше одного раза</small></span></label>
        {error && <p className="tool-error" role="alert">{error}</p>}
        <button className="btn btn-primary tool-submit" type="submit">Сгенерировать <span aria-hidden="true">↗</span></button>
      </form>
      <section className="card tool-result" aria-live="polite" aria-atomic="true">
        <div className="tool-panel-heading"><h2>Результат</h2><span>02</span></div>
        {result.length ? <><span className="eyebrow">Случайная последовательность</span><div className={`tool-number-results ${result.length === 1 ? 'tool-number-results--single' : ''}`}>{result.map((number, i) => <span className="tool-number" key={`${i}-${number}`}>{number}</span>)}</div><p className="tool-result__hint">Сгенерировано: {result.length}</p></> : <div className="tool-empty"><span aria-hidden="true">✳</span><h3>Готово к генерации</h3><p>Укажите параметры слева и нажмите «Сгенерировать».</p></div>}
      </section>
    </div>
    <p className="tool-footnote">Допустимые значения: от 0 до {MAX_SAFE.toLocaleString('ru-RU')}. Для очень больших диапазонов используется генератор случайных значений браузера.</p>
  </div>
}
