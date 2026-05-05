const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const PDF_MARGIN_MM = 8

function safeFileName(name) {
  return String(name || 'biodata')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'biodata'
}

export async function exportPDF(element, name = 'biodata') {
  if (!element) {
    throw new Error('Could not find the biodata preview to export.')
  }

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: Math.min(2, window.devicePixelRatio || 1.5),
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const contentWidth = A4_WIDTH_MM - PDF_MARGIN_MM * 2
  const contentHeight = A4_HEIGHT_MM - PDF_MARGIN_MM * 2
  const imgWidth = contentWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const image = canvas.toDataURL('image/png')

  if (imgHeight <= contentHeight) {
    const y = PDF_MARGIN_MM + Math.max(0, (contentHeight - imgHeight) / 2)
    pdf.addImage(image, 'PNG', PDF_MARGIN_MM, y, imgWidth, imgHeight)
  } else {
    let remainingHeight = imgHeight
    let sourceY = 0
    const pageCanvas = document.createElement('canvas')
    const pageContext = pageCanvas.getContext('2d')
    const pagePixelHeight = Math.floor((contentHeight / imgHeight) * canvas.height)

    pageCanvas.width = canvas.width
    pageCanvas.height = pagePixelHeight

    while (remainingHeight > 0) {
      if (sourceY > 0) pdf.addPage()

      pageContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height)
      pageContext.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        Math.min(pagePixelHeight, canvas.height - sourceY),
        0,
        0,
        pageCanvas.width,
        Math.min(pagePixelHeight, canvas.height - sourceY)
      )

      const pageImageHeight = Math.min(contentHeight, remainingHeight)
      pdf.addImage(
        pageCanvas.toDataURL('image/png'),
        'PNG',
        PDF_MARGIN_MM,
        PDF_MARGIN_MM,
        imgWidth,
        pageImageHeight
      )

      sourceY += pagePixelHeight
      remainingHeight -= contentHeight
    }
  }

  pdf.save(`${safeFileName(name)}-biodata.pdf`)
}
