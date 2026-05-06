const PAGE_W_MM = 210
const PAGE_H_MM = 297
const MARGIN_MM = 3

function safeFileName(name) {
  return String(name || 'biodata')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'biodata'
}

/* Measure element's top position relative to a container using viewport rects */
function relativeOffsetTop(el, container) {
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elRect.top - containerRect.top
}

/* Draw maroon + gold border frame on a canvas context */
function drawBorder(ctx, w, h, sf) {
  ctx.save()
  ctx.strokeStyle = '#6B0F1A'
  ctx.lineWidth = 2.5 * sf
  ctx.strokeRect(6 * sf, 6 * sf, w - 12 * sf, h - 12 * sf)
  ctx.strokeStyle = '#C9A035'
  ctx.lineWidth = sf
  ctx.strokeRect(11 * sf, 11 * sf, w - 22 * sf, h - 22 * sf)
  ctx.restore()
}

/*
 * Smart page breaks — avoids orphaning section headings at bottom of a page.
 * If a divider starts within the last GUARD_PX canvas pixels of a page,
 * the break is moved to just before that divider.
 */
function calcPageBreaks(canvasHeight, pxPerPage, dividerPositions) {
  const GUARD_PX = 220  // canvas pixels — generous guard to catch any heading + its margin

  const breaks = [0]
  let cur = 0

  while (cur < canvasHeight) {
    const rawEnd = cur + pxPerPage
    if (rawEnd >= canvasHeight) break

    // Find a divider that would be stranded at the bottom of this page
    const orphan = dividerPositions.find(
      dy => dy > rawEnd - GUARD_PX && dy <= rawEnd
    )

    const end = orphan
      ? Math.max(cur + pxPerPage * 0.3, orphan - 8)  // break just before the orphan
      : rawEnd

    breaks.push(Math.round(end))
    cur = Math.round(end)
  }

  breaks.push(canvasHeight)
  return breaks
}

export async function exportPDF(element, name = 'biodata') {
  if (!element) throw new Error('Could not find the biodata preview to export.')

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    backgroundColor: '#FDFAF4',
    scale: Math.min(2, window.devicePixelRatio || 1.5),
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const sf = canvas.width / element.offsetWidth  // canvas pixels per CSS pixel

  // Measure all section dividers using offsetTop traversal (reliable, not viewport-relative)
  const dividers = Array.from(element.querySelectorAll('[data-pdf-divider]'))
  const dividerPositions = dividers.map(el => Math.round(relativeOffsetTop(el, element) * sf))

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })

  const maxW = PAGE_W_MM - MARGIN_MM * 2
  const maxH = PAGE_H_MM - MARGIN_MM * 2
  const mmPerPx = maxW / canvas.width
  // Subtract a small bottom buffer so content never touches the decorative bottom border
  const BOTTOM_BUFFER = Math.round(10 * sf)
  const pxPerPage = Math.floor(maxH / mmPerPx) - BOTTOM_BUFFER

  // Extra top space on page 2+ so border sits above content
  const TOP_PAD = Math.round(32 * sf)  // 32 CSS pixels of breathing room

  const pageBreaks = calcPageBreaks(canvas.height, pxPerPage, dividerPositions)

  for (let i = 0; i < pageBreaks.length - 1; i++) {
    if (i > 0) pdf.addPage()

    const srcY = pageBreaks[i]
    const srcH = pageBreaks[i + 1] - srcY
    const isFirst = i === 0

    // Page 2+ gets extra top padding so the border top line is unobscured
    const topPad = isFirst ? 0 : TOP_PAD
    const pageH = srcH + topPad
    const dstH = pageH * mmPerPx

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = pageH
    const ctx = pageCanvas.getContext('2d')

    // Parchment background
    ctx.fillStyle = '#FDFAF4'
    ctx.fillRect(0, 0, canvas.width, pageH)

    // Content — shifted down on page 2+ to make room for top border
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, topPad, canvas.width, srcH)

    // Border drawn last so it sits on top of everything
    drawBorder(ctx, canvas.width, pageH, sf)

    // "Continued" label in the top padding area on page 2+
    if (!isFirst) {
      ctx.save()
      ctx.fillStyle = '#9B7320'
      ctx.font = `600 ${8 * sf}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(
        `${(name || 'biodata').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} · Continued`,
        canvas.width / 2,
        22 * sf
      )
      ctx.restore()
    }

    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', MARGIN_MM, MARGIN_MM, maxW, dstH)
  }

  pdf.save(`${safeFileName(name)}-biodata.pdf`)
}
