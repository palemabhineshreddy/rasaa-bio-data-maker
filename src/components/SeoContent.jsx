import { useEffect, useState } from 'react'
import { useBuilderTheme } from '../contexts/ThemeContext'

// Crawlable article for SEO landing pages (/<topic>/) plus a links grid to every format page.
// The page data is loaded lazily so it stays out of the main bundle.
export default function SeoContent() {
  const T = useBuilderTheme()
  const [pages, setPages] = useState(null)
  const current = typeof window !== 'undefined' ? window.__SEO_PAGE__ : null

  useEffect(() => {
    import('../seo/pages.js').then(m => setPages(m)).catch(() => {})
  }, [])

  if (!pages) return null
  const page = current ? pages.PAGE_BY_SLUG[current.slug] : null
  const links = pages.ALL_PAGES.filter(p => !page || p.slug !== page.slug)
  const h2 = { fontSize: 20, fontWeight: 700, margin: '28px 0 10px', lineHeight: 1.3, color: T.text }
  const li = { margin: '6px 0', color: T.textMuted, lineHeight: 1.65 }

  return (
    <section style={{ background: T.pageBg, color: T.text, padding: '56px 16px', borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {page && (
          <article>
            <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{page.h1}</h2>
            <p style={{ ...li, fontSize: 16, marginTop: 14 }}>{page.intro}</p>
            {page.fields?.length > 0 && (<><h2 style={h2}>What to include</h2><ul style={{ paddingLeft: 20 }}>{page.fields.map(f => <li key={f} style={li}>{f}</li>)}</ul></>)}
            {page.tips?.length > 0 && (<><h2 style={h2}>Tips</h2><ul style={{ paddingLeft: 20 }}>{page.tips.map(f => <li key={f} style={li}>{f}</li>)}</ul></>)}
            {page.faq?.length > 0 && (<><h2 style={h2}>FAQ</h2>{page.faq.map(([q, a]) => (<div key={q}><h3 style={{ fontSize: 16, fontWeight: 600, margin: '14px 0 4px' }}>{q}</h3><p style={li}>{a}</p></div>))}</>)}
          </article>
        )}
        <h2 style={h2}>Biodata formats and designs</h2>
        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '4px 20px' }}>
          {links.map(p => (
            <li key={p.slug} style={li}>
              <a href={`/${p.slug}/`} style={{ color: T.textMuted, textDecoration: 'underline', textUnderlineOffset: 3 }}>{p.h1}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
