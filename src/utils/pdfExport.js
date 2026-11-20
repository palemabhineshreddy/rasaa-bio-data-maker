import { loadImage, cropCover } from './photo'

const A4_RATIO = 297 / 210
const MM_PER_CSS_PX = 25.4 / 96
const MAX_CANVAS_PIXELS = 12_000_000
const MAX_CANVAS_SIDE = 4096

function safeFileName(name) {
  return String(name || 'biodata')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'biodata'
}

async function buildPDF(element, name) {
  if (!element) throw new Error('Could not find the biodata preview to export.')

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  // Page zoom other than 100% (Android font-size setting, Ctrl −/+) makes html2canvas mis-measure
  // the layout: hairlines collapse, ornaments drop out, text overlaps. Counter-zoom the element
  // back to 100% while capturing; if that has no effect, at least scale up to keep resolution.
  const measureZoom = () => element.getBoundingClientRect().width / element.offsetWidth || 1
  const prevZoom = element.style.zoom
  const pageZoom = measureZoom()
  if (Math.abs(pageZoom - 1) > 0.01) element.style.zoom = String(1 / pageZoom)
  const zoom = Math.min(4, Math.max(0.25, measureZoom()))

  const pdfW = element.offsetWidth * MM_PER_CSS_PX
  const pdfH = pdfW * A4_RATIO
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH], compress: true })

  let pages = []
  try {
    pages = paginate(element)
    for (const [i, page] of pages.entries()) {
      // Phones refuse canvases past ~16.7M pixels or 4096px a side; stay well under so even
      // zoom-compensated renders never fail. Low-memory Android may still fail at 2x, so retry lower.
      const maxScale = Math.min(MAX_CANVAS_SIDE / page.offsetHeight, Math.sqrt(MAX_CANVAS_PIXELS / (page.offsetWidth * page.offsetHeight)))
      let canvas, lastErr
      for (const scale of [2, 1.5, 1]) {
        try { canvas = await renderCanvas(html2canvas, page, Math.min(scale / zoom, maxScale)); break } catch (e) { lastErr = e }
      }
      if (!canvas) throw lastErr
      if (i > 0) pdf.addPage([pdfW, pdfH], 'portrait')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
    }
  } finally {
    pages.forEach(p => p.remove())
    element.style.zoom = prevZoom
  }

  return { pdf, fileName: `${safeFileName(name)}-biodata.pdf` }
}

// Split the biodata into A4 pages. Each page is a copy of the template cut to A4 height that shows
// only the rows that fit; templates mark rows (data-pdf-row), section headings (data-pdf-divider),
// page-1-only blocks such as the name and photo (data-pdf-first) and a closing line
// (data-pdf-last). Rows are never split, a heading never ends a page, and a section that
// continues onto a new page repeats its heading there.
export function paginate(element) {
  const pageH = Math.round(element.offsetWidth * A4_RATIO)
  const hide = el => { el.style.display = 'none' }
  const pages = []
  let start = 0
  for (;;) {
    const page = element.cloneNode(true)
    element.parentNode.appendChild(page)
    page.style.minHeight = ''
    const root = page.querySelector('.pdf-area') || page
    Object.assign(root.style, { height: `${pageH}px`, minHeight: `${pageH}px`, overflow: 'hidden' })
    const blocks = [...page.querySelectorAll('[data-pdf-row], [data-pdf-divider]')]

    if (pages.length > 0) {
      page.querySelectorAll('[data-pdf-first]').forEach(el => {
        hide(el)
        if (getComputedStyle(el.parentElement).display === 'grid') el.parentElement.style.gridTemplateColumns = '1fr'
      })
      blocks.slice(0, start).forEach(hide)
      if (blocks[start]?.hasAttribute('data-pdf-row')) {
        const heading = blocks.slice(0, start).reverse().find(b => b.hasAttribute('data-pdf-divider'))
        if (heading) heading.style.display = ''
      }
    }

    // Measure in the page's own (possibly zoomed) coordinates
    const box = root.getBoundingClientRect()
    const k = box.width / root.offsetWidth || 1
    const limit = box.top + (pageH - Number(root.dataset.pdfBottom || 40)) * k
    let end = start
    while (end < blocks.length && blocks[end].getBoundingClientRect().bottom <= limit) end++
    while (end > start + 1 && blocks[end - 1].hasAttribute('data-pdf-divider') && blocks[end]?.hasAttribute('data-pdf-row')) end--
    if (end === start && start < blocks.length) end = start + 1
    blocks.slice(end).forEach(hide)
    if (end < blocks.length) page.querySelectorAll('[data-pdf-last]').forEach(hide)

    pages.push(page)
    if (end >= blocks.length) return pages
    start = end
  }
}

// html2canvas 1.4.1 truncates fractional background sizes when it builds pattern canvases
// (e.g. a 1px gradient line measures 0.9px when Android/desktop page zoom is below 100%),
// then createPattern throws on the 0-size canvas. Swap in a blank 1×1 canvas instead.
async function withSafeCreatePattern(fn) {
  const proto = CanvasRenderingContext2D.prototype
  const original = proto.createPattern
  proto.createPattern = function (image, repetition) {
    if (image instanceof HTMLCanvasElement && (image.width === 0 || image.height === 0)) {
      image = document.createElement('canvas')
      image.width = image.height = 1
    }
    return original.call(this, image, repetition)
  }
  try { return await fn() } finally { proto.createPattern = original }
}

function renderCanvas(html2canvas, element, scale) {
  return withSafeCreatePattern(() => html2canvas(element, {
    backgroundColor: '#FDFDF9',
    scale,
    useCORS: true,
    logging: false,
    onclone: (_doc, clonedElement) => {
      // The container uses transform:translateX(-9999px) to hide off-screen while
      // keeping layout-position at (0,0) so Chrome always computes child dimensions.
      // Strip the transform here so html2canvas renders the clone at (0,0).
      let node = clonedElement.parentElement
      while (node && node !== _doc.body) {
        if (node.style.position === 'fixed' || node.style.position === 'absolute') {
          node.style.left = '0px'
          node.style.top = '0px'
          node.style.transform = 'none'
        }
        node = node.parentElement
      }
      return sharpenPhotos(_doc, clonedElement, scale)
    },
  }))
}

// html2canvas shrinks background images to their CSS-pixel box size and then upscales by
// `scale`, so template photos come out at half resolution. Swap each photo for an <img> that is
// pre-cropped to the box at full output resolution; html2canvas draws <img> without resampling.
async function sharpenPhotos(doc, root, scale) {
  const boxes = [root, ...root.querySelectorAll('*')].filter(n => /^url\(/.test(n.style.backgroundImage))
  await Promise.all(boxes.map(async (box) => {
    const src = box.style.backgroundImage.slice(4, -1).replace(/^["']|["']$/g, '')
    const w = box.clientWidth, h = box.clientHeight
    if (!w || !h) return
    const [px = 50, py = 50] = (box.style.backgroundPosition.match(/[\d.]+(?=%)/g) || []).map(Number)
    try {
      const img = await loadImage(src, doc)
      const k = Math.min(scale, 4)
      const crop = cropCover(img, w, h, px, py, Math.round(w * k), Math.round(h * k), doc)
      const sharp = await loadImage(crop.toDataURL('image/jpeg', 0.92), doc)
      sharp.style.cssText = 'display:block;width:100%;height:100%;border-radius:inherit'
      box.style.backgroundImage = 'none'
      box.style.overflow = 'hidden'
      box.appendChild(sharp)
    } catch { /* keep the background-image version */ }
  }))
}

// Download the PDF and return the blob so the caller can reuse it for sharing
export async function exportPDF(element, name = 'biodata') {
  const { pdf, fileName } = await buildPDF(element, name)
  pdf.save(fileName)
  return { blob: pdf.output('blob'), fileName }
}
