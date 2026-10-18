import { useEffect, useRef, useState } from 'react'

// Renders children only once the placeholder is near the viewport, so below-the-fold
// sections (and the images they pull in) don't compete with the first paint.
// While unmounted the placeholder carries `id`, so in-page anchors (#templates) still land correctly.
export default function LazyMount({ children, id, minHeight = 600, rootMargin = '800px' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (show) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [show, rootMargin])

  if (show) return children
  return <div ref={ref} id={id} style={{ minHeight }} />
}
