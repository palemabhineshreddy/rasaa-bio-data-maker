import { loadImage, cropCover } from './photo'

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

  // Low-memory Android browsers can fail to allocate a 2x canvas; retry at lower scales
  let canvas, lastErr
  try {
    for (const scale of [2, 1.5, 1]) {
      try { canvas = await renderCanvas(html2canvas, element, scale / zoom); break } catch (e) { lastErr = e }
    }
  } finally {
    element.style.zoom = prevZoom
  }
  if (!canvas) throw lastErr

  // Size the page from the unzoomed layout width so the PDF is the same at any zoom
  const MM_PER_CSS_PX = 25.4 / 96
  const pdfW = element.offsetWidth * MM_PER_CSS_PX
  const pdfH = pdfW * canvas.height / canvas.width

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfW, pdfH],
    compress: true,
  })

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)

  return { pdf, fileName: `${safeFileName(name)}-biodata.pdf` }
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
