// Photo helpers shared by the builder (upload, adjuster) and PDF export.

export const PHOTO_MAX_BYTES = 20 * 1024 * 1024
const PHOTO_MAX_SIDE = 1600

export function loadImage(src, doc = document) {
  return new Promise((resolve, reject) => {
    const img = doc.createElement('img')
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the photo.'))
    img.src = src
  })
}

// Downscale in halving steps: one big drawImage jump (e.g. 4000px → 300px) skips most source
// pixels and looks jagged, especially on Android.
function drawSmooth(src, sx, sy, sw, sh, outW, outH, doc = document) {
  let cur = src, cx = sx, cy = sy, cw = sw, ch = sh
  while (cw / 2 >= outW && ch / 2 >= outH) {
    const step = doc.createElement('canvas')
    step.width = Math.round(cw / 2)
    step.height = Math.round(ch / 2)
    const g = step.getContext('2d')
    g.imageSmoothingQuality = 'high'
    g.drawImage(cur, cx, cy, cw, ch, 0, 0, step.width, step.height)
    cur = step; cx = 0; cy = 0; cw = step.width; ch = step.height
  }
  const out = doc.createElement('canvas')
  out.width = outW
  out.height = outH
  const g = out.getContext('2d')
  g.imageSmoothingQuality = 'high'
  g.drawImage(cur, cx, cy, cw, ch, 0, 0, outW, outH)
  return out
}

// Shrink an uploaded photo to at most 1600px on its long side. Phone photos are 4000px+ and
// several MB; the biodata never shows more than ~600px of one, and huge images cost memory.
export async function preparePhoto(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const k = Math.min(1, PHOTO_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k)
    return drawSmooth(img, 0, 0, img.naturalWidth, img.naturalHeight, w, h).toDataURL('image/jpeg', 0.92)
  } finally {
    URL.revokeObjectURL(url)
  }
}

// The part of an image that `background-size: cover; background-position: px% py%` shows in a
// boxW×boxH box, rendered at outW×outH.
export function cropCover(img, boxW, boxH, px, py, outW, outH, doc = document) {
  const iw = img.naturalWidth, ih = img.naturalHeight
  const s = Math.max(boxW / iw, boxH / ih)
  const sw = boxW / s, sh = boxH / s
  const sx = (iw - sw) * px / 100, sy = (ih - sh) * py / 100
  return drawSmooth(img, sx, sy, sw, sh, outW, outH, doc)
}

// Cut the area chosen in the crop dialog out of the original and save it at 800×1000 (4:5),
// enough for the largest template photo box at the PDF's 2× scale with room to spare.
export async function cropToImage(src, area) {
  const img = await loadImage(src)
  const outW = Math.min(800, Math.round(area.width))
  const outH = Math.round(outW * area.height / area.width)
  return drawSmooth(img, area.x, area.y, area.width, area.height, outW, outH).toDataURL('image/jpeg', 0.92)
}
