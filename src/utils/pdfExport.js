function safeFileName(name) {
  return String(name || 'biodata')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'biodata'
}

export async function exportPDF(element, name = 'biodata') {
  if (!element) throw new Error('Could not find the biodata preview to export.')

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  // Capture the element exactly as rendered in the preview
  const canvas = await html2canvas(element, {
    backgroundColor: '#FDFDF9',
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  // Convert canvas size to mm (96 CSS dpi, scale:2 means canvas is 2x CSS pixels)
  // 1 CSS px = 25.4 / 96 mm
  const MM_PER_CSS_PX = 25.4 / 96
  const cssW = canvas.width / 2
  const cssH = canvas.height / 2
  const pdfW = cssW * MM_PER_CSS_PX
  const pdfH = cssH * MM_PER_CSS_PX

  // Create a PDF whose page is exactly the same size as the preview element
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfW, pdfH],
    compress: true,
  })

  // Place the full canvas image — no scaling, no cropping, no additions
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)

  pdf.save(`${safeFileName(name)}-biodata.pdf`)
}
