export function convertToSeconds(timeStr: string) {
  // Если timeStr является числом, возвращаем его
  if (!isNaN(Number(timeStr))) {
    return parseInt(timeStr)
  }

  const multipliers: { [key: string]: number } = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    M: 30 * 24 * 60 * 60,
    y: 365 * 24 * 60 * 60
  }

  const unit = timeStr.slice(-1)
  const num = parseInt(timeStr.slice(0, -1))

  const multiplier = multipliers[unit]

  if (multiplier === undefined) {
    throw new Error('Invalid time string')
  }

  return num * multiplier
}
