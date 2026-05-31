import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useBuilderTheme } from '../contexts/ThemeContext'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, LANGUAGES } = useLanguage()
  const T = useBuilderTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const G = T.globeBtn
  const D = T.globeDropdown

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: compact ? '6px 10px' : '7px 12px',
          borderRadius: 100,
          border: `1px solid ${open ? G.hoverBorder : G.border}`,
          background: open ? G.hoverBg : G.bg,
          color: open ? G.hoverColor : G.color,
          boxShadow: 'none',
          cursor: 'pointer',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.background = G.hoverBg
            e.currentTarget.style.borderColor = G.hoverBorder
            e.currentTarget.style.color = G.hoverColor
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = G.bg
            e.currentTarget.style.borderColor = G.border
            e.currentTarget.style.color = G.color
          }
        }}
      >
        <Globe size={compact ? 13 : 14} style={{ opacity: 0.7 }} />
        <span>{current.nativeName}</span>
        <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 1 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: D.bg, border: `1px solid ${D.border}`,
          borderRadius: 12, overflow: 'hidden',
          boxShadow: D.shadow,
          zIndex: 500, minWidth: 160,
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 12,
                padding: '10px 16px', border: 'none', cursor: 'pointer',
                background: lang === l.code ? D.selectedBg : 'transparent',
                color: lang === l.code ? D.selectedText : D.text,
                fontSize: 13, fontWeight: lang === l.code ? 600 : 400,
                transition: 'background 0.1s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = D.hoverBg }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
            >
              <span>{l.nativeName}</span>
              <span style={{ fontSize: 11, opacity: 0.45, color: D.textMuted }}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
