export const MAX_SAFE = Number.MAX_SAFE_INTEGER

// Unbiased integer from [0, bound), where bound is a positive BigInt <= 2^53.
export function secureBelow(bound) {
  if (bound <= 0n || bound > BigInt(MAX_SAFE) + 1n) throw new RangeError('Недопустимый диапазон')
  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.getRandomValues) throw new Error('Генератор случайных чисел недоступен в этом браузере')
  const ceiling = ((1n << 64n) / bound) * bound
  const buffer = new BigUint64Array(1)
  do { cryptoApi.getRandomValues(buffer) } while (buffer[0] >= ceiling)
  return buffer[0] % bound
}

export function parseSafeNumber(raw, label) {
  const value = String(raw).trim()
  if (!/^\d+$/.test(value)) throw new Error(`${label}: введите целое неотрицательное число`)
  const result = Number(value)
  if (!Number.isSafeInteger(result)) throw new Error(`${label}: максимальное значение ${MAX_SAFE}`)
  return result
}

export function parseNumberList(raw, label) {
  const tokens = String(raw).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
  return tokens.map((token) => parseSafeNumber(token, label))
}

export function generateNumbers({ source, min, max, list, excluded, count, unique }) {
  if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error('Количество должно быть от 1 до 200')
  const excludedSet = new Set(excluded)
  if (source === 'list') {
    const available = list.filter((item) => !excludedSet.has(item))
    if (!available.length) throw new Error('После исключений список пуст')
    const pool = unique ? [...new Set(available)] : available
    if (unique && count > pool.length) throw new Error(`Без повторений можно выбрать максимум ${pool.length}`)
    const output = []
    for (let i = 0; i < count; i++) {
      const index = Number(secureBelow(BigInt(pool.length)))
      output.push(pool[index])
      if (unique) pool.splice(index, 1)
    }
    return output
  }
  if (min > max) throw new Error('Начало диапазона не может быть больше конца')
  const usableExclusions = [...excludedSet].filter((v) => v >= min && v <= max)
  const population = BigInt(max) - BigInt(min) + 1n - BigInt(usableExclusions.length)
  if (population <= 0n) throw new Error('Все числа исключены')
  if (unique && BigInt(count) > population) throw new Error('Доступных чисел меньше, чем запрошено без повторений')
  // Small domains (especially with many exclusions) are sampled directly.
  if (BigInt(max) - BigInt(min) + 1n <= 100000n) {
    const available = []
    for (let value = min; value <= max; value++) {
      if (!excludedSet.has(value)) available.push(value)
    }
    const output = []
    for (let i = 0; i < count; i++) {
      const index = Number(secureBelow(BigInt(available.length)))
      output.push(available[index])
      if (unique) available.splice(index, 1)
    }
    return output
  }
  const generated = new Set()
  const output = []
  // Rejection sampling is efficient for at most 200 draws, including huge ranges.
  while (output.length < count) {
    const value = Number(BigInt(min) + secureBelow(BigInt(max) - BigInt(min) + 1n))
    if (excludedSet.has(value) || (unique && generated.has(value))) continue
    output.push(value)
    generated.add(value)
  }
  return output
}
