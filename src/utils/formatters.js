const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function ordinal(n) {
  const d = parseInt(n, 10)
  if (d > 3 && d < 21) return `${d}th`
  switch (d % 10) {
    case 1: return `${d}st`
    case 2: return `${d}nd`
    case 3: return `${d}rd`
    default: return `${d}th`
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return null
  const parts = String(dateStr).split('-')
  if (parts.length !== 3) return dateStr
  const [year, month, day] = parts
  const m = MONTHS[parseInt(month, 10) - 1]
  if (!m) return dateStr
  return `${ordinal(day)} ${m}, ${year}`
}
