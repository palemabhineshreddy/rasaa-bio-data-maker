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

  const canvas = await html2canvas(element, {
    backgroundColor: '#FDFDF9',
    scale: 2,
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
    },
  })

  const MM_PER_CSS_PX = 25.4 / 96
  const cssW = canvas.width / 2
  const cssH = canvas.height / 2
  const pdfW = cssW * MM_PER_CSS_PX
  const pdfH = cssH * MM_PER_CSS_PX

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfW, pdfH],
    compress: true,
  })

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)

  return { pdf, fileName: `${safeFileName(name)}-biodata.pdf` }
}

// Download the PDF and return the blob so the caller can reuse it for sharing
export async function exportPDF(element, name = 'biodata') {
  const { pdf, fileName } = await buildPDF(element, name)
  pdf.save(fileName)
  return { blob: pdf.output('blob'), fileName }
}
