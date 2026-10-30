import { secureBelow } from './randomTools.js'

// Syntax at the end of a line: "Название !!35%". A bare "!!" is part of the label.
export function parseWheelOptions(raw) {
  const lines = String(raw).split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  if (lines.length > 120) throw new Error('Максимум 120 вариантов')
  if (lines.length < 2) throw new Error('Добавьте минимум два варианта')
  return lines.map((line, index) => {
    const match = line.match(/^(.*?)\s*!!(\d+)%$/)
    if (match) {
      const label = match[1].trim()
      const percent = Number(match[2])
      if (!label) throw new Error(`Строка ${index + 1}: не указано название варианта`)
      if (!Number.isSafeInteger(percent) || percent < 0 || percent > 100) throw new Error(`Строка ${index + 1}: процент должен быть целым числом от 0 до 100`)
      return { label, fixed: percent }
    }
    // Detect attempted, but incorrectly formatted, trailing annotations.
    if (/!!\s*[-+]?\d/.test(line)) throw new Error(`Строка ${index + 1}: используйте запись !!35% (целое число от 0 до 100)`)
    return { label: line, fixed: null }
  })
}

export function getWheelOptions(raw) {
  const entries = parseWheelOptions(raw)
  const fixedTotal = entries.reduce((sum, item) => sum + (item.fixed ?? 0), 0)
  const autoCount = entries.filter((item) => item.fixed === null).length
  if (fixedTotal > 100) throw new Error(`Сумма заданных процентов ${fixedTotal}% превышает 100%`)
  if (!autoCount && fixedTotal !== 100) throw new Error('Сумма заданных процентов должна составлять 100%')
  const remaining = 100 - fixedTotal
  const base = autoCount ? Math.floor(remaining / autoCount) : 0
  let spare = autoCount ? remaining % autoCount : 0
  const result = entries.map((item) => {
    if (item.fixed !== null) return { ...item, chance: item.fixed }
    const chance = base + (spare > 0 ? 1 : 0)
    spare = Math.max(0, spare - 1)
    return { ...item, chance }
  })
  if (!result.some((item) => item.chance > 0)) throw new Error('Нужен хотя бы один вариант с ненулевым шансом')
  return result
}

const namedColors = {
  'красный': '#dc3545', red: '#dc3545', 'алый': '#e23838',
  'оранжевый': '#ea7a25', orange: '#ea7a25',
  'жёлтый': '#eac236', 'желтый': '#eac236', yellow: '#eac236',
  'зелёный': '#2fa36a', 'зеленый': '#2fa36a', green: '#2fa36a',
  'синий': '#3176d2', blue: '#3176d2',
  'голубой': '#39a9da', cyan: '#39a9da', 'бирюзовый': '#24acb4',
  'фиолетовый': '#834bc8', purple: '#834bc8', violet: '#834bc8',
  'розовый': '#df71ac', pink: '#df71ac',
  'белый': '#e2e8f0', white: '#e2e8f0',
  'чёрный': '#1d293a', 'черный': '#1d293a', black: '#1d293a',
  'серый': '#758294', grey: '#758294', gray: '#758294',
  'коричневый': '#9a633f', brown: '#9a633f',
}
export function wheelColor(name, index, count) {
  return namedColors[name.trim().toLowerCase()] ?? `hsl(${Math.round(index * 360 / count + 212) % 360} 64% 48%)`
}

export function pickWheelOption(items) {
  const ticket = Number(secureBelow(100n))
  let subtotal = 0
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].chance
    if (ticket < subtotal) return i
  }
  throw new Error('Невозможно выбрать вариант')
}

// Angles 0..360 start at 12 o'clock and increase clockwise.
export function wheelSegments(items) {
  let from = 0
  return items.map((item) => {
    const start = from
    from += item.chance * 3.6
    return { ...item, start, end: from, center: (start + from) / 2 }
  })
}

export function wheelPath(start, end, radius = 190, cx = 200, cy = 200) {
  const point = (angle) => {
    const radians = angle * Math.PI / 180
    return `${cx + radius * Math.sin(radians)} ${cy - radius * Math.cos(radians)}`
  }
  if (end - start >= 359.999) return null
  return `M ${cx} ${cy} L ${point(start)} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${point(end)} Z`
}
