import { useEffect, useState } from 'react'
import { useBuilderTheme } from '../contexts/ThemeContext'

// Crawlable article for SEO landing pages (/<topic>/). The links to every format page live in the
// landing footer (FormatLinks below). The page data is loaded lazily so it stays out of the main bundle.
export default function SeoContent() {
  const T = useBuilderTheme()
  const [pages, setPages] = useState(null)
  const current = typeof window !== 'undefined' ? window.__SEO_PAGE__ : null

  useEffect(() => {
    if (current) import('../seo/pages.js').then(m => setPages(m)).catch(() => {})
  }, [current])

  const page = pages && current ? pages.PAGE_BY_SLUG[current.slug] : null
  if (!page) return null
  const h2 = { fontSize: 20, fontWeight: 700, margin: '28px 0 10px', lineHeight: 1.3, color: T.text }
  const li = { margin: '6px 0', color: T.textMuted, lineHeight: 1.65 }

  return (
    <section style={{ background: T.pageBg, color: T.text, padding: '56px 16px', borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Heading + intro are already in the hero; "See what to include ↓" jumps here */}
        <article id="guide" style={{ scrollMarginTop: 80 }}>
          {page.fields?.length > 0 && (<><h2 style={h2}>What to include</h2><ul style={{ paddingLeft: 20 }}>{page.fields.map(f => <li key={f} style={li}>{f}</li>)}</ul></>)}
          {page.tips?.length > 0 && (<><h2 style={h2}>Tips</h2><ul style={{ paddingLeft: 20 }}>{page.tips.map(f => <li key={f} style={li}>{f}</li>)}</ul></>)}
          {page.faq?.length > 0 && (<><h2 style={h2}>FAQ</h2>{page.faq.map(([q, a]) => (<div key={q}><h3 style={{ fontSize: 16, fontWeight: 600, margin: '14px 0 4px' }}>{q}</h3><p style={li}>{a}</p></div>))}</>)}
        </article>
      </div>
    </section>
  )
}

// Footer link list to every format page: one small muted line that expands the footer in place.
// Collapsed, not hidden: links visitors cannot reach at all would break Google's hidden-links policy.
export function FormatLinks({ color }) {
  const [groups, setGroups] = useState(null)
  const current = typeof window !== 'undefined' ? window.__SEO_PAGE__?.slug : null

  useEffect(() => {
    import('../seo/pages.js').then(m => setGroups(m.LINK_GROUPS)).catch(() => {})
  }, [])

  if (!groups) return null
  return (
    <details style={{ marginTop: 12 }}>
      <summary className="summary-plain" style={{ fontSize: 11, color, cursor: 'pointer', display: 'inline-block' }}>
        All biodata formats ▾
      </summary>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '8px 24px', marginTop: 14 }}>
        {groups.map(g => (
          <div key={g.title}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color, margin: '0 0 6px', opacity: 0.8 }}>{g.title}</p>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {g.pages.filter(p => p.slug !== current).map(p => (
                <li key={p.slug} style={{ margin: '4px 0', fontSize: 12, lineHeight: 1.45 }}>
                  <a href={`/${p.slug}/`} style={{ color, textDecoration: 'none' }}>{p.h1}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  )
}
