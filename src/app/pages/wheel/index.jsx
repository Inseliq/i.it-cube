import { useEffect, useMemo, useRef, useState } from 'react'
import { getWheelOptions, pickWheelOption, wheelColor, wheelPath, wheelSegments } from '../../utils/wheelTools'
import '../../styles/css/tools.css'

const DEFAULT_OPTIONS = 'Красный\nСиний\nФиолетовый !!35%'

function WheelGraphic({ items, rotation, spinning }) {
  const segments = useMemo(() => wheelSegments(items), [items])
  return <div className="fortune-stage">
    <div className="fortune-pointer" aria-hidden="true" />
    <svg className="fortune-wheel" viewBox="0 0 400 400" role="img" aria-label="Колесо фортуны с секторами и подписями" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4800ms cubic-bezier(0.12, 0.75, 0.12, 1)' : 'none' }}>
      <circle cx="200" cy="200" r="192" fill="#19283c" />
      {segments.map((item, index) => {
        if (!item.chance) return null
        const color = wheelColor(item.label, index, items.length)
        const path = wheelPath(item.start, item.end)
        const radians = item.center * Math.PI / 180
        const textRadius = item.chance < 8 ? 158 : 125
        const x = 200 + textRadius * Math.sin(radians)
        const y = 200 - textRadius * Math.cos(radians)
        return <g key={index}>
          {path ? <path d={path} fill={color} stroke="#0b1220" strokeWidth="2" /> : <circle cx="200" cy="200" r="190" fill={color} />}
          {item.chance >= 4 && <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={items.length > 14 ? 10 : item.chance < 9 ? 11 : 14} fontWeight="700" fill="white" stroke="#162133" strokeWidth="2.5" paintOrder="stroke" >{item.label.length > (items.length > 14 ? 8 : 15) ? `${item.label.slice(0, items.length > 14 ? 7 : 14)}…` : item.label}</text>}
        </g>
      })}
      <circle cx="200" cy="200" r="25" fill="#142137" stroke="#e0e9f6" strokeWidth="6" />
      <circle cx="200" cy="200" r="7" fill="#7ca7ff" />
    </svg>
  </div>
}

export default function WheelPage() {
  const [raw, setRaw] = useState(DEFAULT_OPTIONS)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [history, setHistory] = useState([])
  const timerRef = useRef(null)
  const options = useMemo(() => {
    try { return { items: getWheelOptions(raw), error: '' } }
    catch (error) { return { items: [], error: error.message } }
  }, [raw])
  const items = options.items

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])

  function spin() {
    if (spinning || options.error || !items.length) return
    let selected
    try { selected = pickWheelOption(items) }
    catch { return }
    const segment = wheelSegments(items)[selected]
    const relative = ((rotation % 360) + 360) % 360
    const destination = ((360 - segment.center) % 360 + 360) % 360
    const delta = (destination - relative + 360) % 360
    const next = rotation + 360 * 6 + delta
    setWinner(null)
    setSpinning(true)
    // Ensure CSS transition starts after React applies the new rotation.
    window.requestAnimationFrame(() => setRotation(next))
    timerRef.current = window.setTimeout(() => {
      const chosen = { ...items[selected], index: selected + 1 }
      setWinner(chosen)
      setHistory((old) => [chosen, ...old].slice(0, 5))
      setSpinning(false)
    }, 4850)
  }

  return <div className="page-shell tool-page">
    <header className="tool-hero"><span className="eyebrow">Инструменты / случайный выбор</span><h1 className="page-title">Колесо фортуны</h1><p className="page-lead">Добавляйте варианты и запускайте колесо. Можно задать точный шанс отдельных секторов.</p></header>
    <div className="tool-grid tool-grid--wheel">
      <section className="card tool-settings"><div className="tool-panel-heading"><h2>Варианты</h2><span>01</span></div>
        <label className="tool-field" htmlFor="wheel-options">Один вариант на строку</label>
        <textarea className="tool-wheel-textarea" id="wheel-options" rows={12} spellCheck={false} value={raw} disabled={spinning} onChange={(e) => { setRaw(e.target.value); setWinner(null); setRotation(0) }} />
        <div className="tool-guide"><strong>Как задать вероятность?</strong><p>Например: <code>Фиолетовый !!35%</code>. Остальные варианты разделят оставшиеся 65%.</p><p>Используйте только целые проценты. <code>!!35</code> − ошибка, а <code>35%</code> и отдельное <code>!!</code> считаются обычным текстом.</p></div>
        {options.error && <p className="tool-error" role="alert">{options.error}</p>}
        {!options.error && <div className="tool-chances" aria-label="Шансы вариантов">{items.map((item, index) => <div className="tool-chance-row" key={index}><span className="tool-color-dot" style={{ background: wheelColor(item.label, index, items.length) }} /><span className="tool-chance-label">{item.label}</span><strong>{item.chance}%</strong>{(item.fixed === 0 || item.fixed === 100) && <small className="tool-chance-warning">{item.fixed === 0 ? '(нет смысла: не выпадет)' : '(нет смысла: всегда выпадет)'}</small>}</div>)}</div>}
      </section>
      <section className="card tool-result tool-wheel-result"><div className="tool-panel-heading"><h2>Крутить колесо</h2><span>02</span></div>
        {items.length ? <WheelGraphic items={items} rotation={rotation} spinning={spinning} /> : <div className="tool-empty">Исправьте список вариантов, чтобы увидеть колесо.</div>}
        <button className="btn btn-primary tool-submit" type="button" disabled={spinning || !!options.error} onClick={spin}>{spinning ? 'Колесо вращается…' : 'Крутить колесо ↗'}</button>
        <div className="fortune-winner" role="status" aria-live="polite">{winner ? <><span className="eyebrow">Выпал вариант</span><strong>{winner.label}</strong><span>Вероятность: {winner.chance}%</span></> : <span className="fortune-placeholder">{spinning ? 'Определяем результат…' : 'Нажмите кнопку для первого вращения'}</span>}</div>
        {history.length > 0 && <div className="fortune-history"><h3>Последние результаты</h3><div>{history.map((item, i) => <span key={`${i}-${item.index}`}>{item.label}</span>)}</div></div>}
      </section>
    </div>
  </div>
}
