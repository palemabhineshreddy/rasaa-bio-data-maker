import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, LANGUAGES } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: compact ? '6px 10px' : '7px 12px',
          borderRadius: 100,
          border: `1px solid ${open ? 'rgba(237,137,54,0.6)' : 'rgba(107,70,193,0.35)'}`,
          background: open ? 'rgba(237,137,54,0.1)' : 'rgba(107,70,193,0.1)',
          color: open ? '#ed8936' : 'rgba(255,255,255,0.65)',
          boxShadow: open ? '0 0 14px rgba(237,137,54,0.18)' : 'none',
          cursor: 'pointer',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.background = 'rgba(237,137,54,0.1)'
            e.currentTarget.style.borderColor = 'rgba(237,137,54,0.6)'
            e.currentTarget.style.color = '#ed8936'
            e.currentTarget.style.boxShadow = '0 0 14px rgba(237,137,54,0.18)'
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = 'rgba(107,70,193,0.1)'
            e.currentTarget.style.borderColor = 'rgba(107,70,193,0.35)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
            e.currentTarget.style.boxShadow = 'none'
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
          background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
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
                background: lang === l.code ? 'rgba(200,150,12,0.15)' : 'transparent',
                color: lang === l.code ? '#F0B820' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: lang === l.code ? 600 : 400,
                transition: 'background 0.1s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
            >
              <span>{l.nativeName}</span>
              <span style={{ fontSize: 11, opacity: 0.45 }}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
