import { useId } from 'react'

// Thin gradient strip drawn as inline SVG instead of a CSS gradient. html2canvas renders CSS
// gradients through a pattern canvas whose size it truncates, so 1–5px strips collapse to 0px
// (crashing or vanishing from the PDF) when page zoom is below 100%. SVG is drawn as an image.
// stops: [[offset 0–1, color, opacity?], ...]
export default function GradientStrip({ stops, vertical = false, style }) {
  const id = 'gs' + useId().replace(/:/g, '')
  return (
    <div style={style}>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 0}>
            {stops.map(([offset, color, opacity = 1]) => (
              <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
            ))}
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  )
}
