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
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.12)',
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
          fontSize: compact ? 12 : 13,
          fontWeight: 500,
          transition: 'all 0.15s',
        }}
      >
        <Globe size={compact ? 13 : 14} style={{ opacity: 0.7 }} />
        <span>{current.nativeName}</span>
        <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 1 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#13132a', border: '1px solid rgba(255,255,255,0.1)',
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
                background: lang === l.code ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: lang === l.code ? '#c084fc' : 'rgba(255,255,255,0.7)',
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
