import { formatDate } from '../utils/formatters'
import { useLanguage } from '../contexts/LanguageContext'

/*
 * Bandhan — Biodata Template Engine
 * One component, 7 themes. Set data.template to switch the look.
 * Content layout is identical across all themes — only colors + border ornaments change.
 */

/* ── Slogan system ── */
const HINDU_SLOGANS = {
  hindi:      '॥ श्री गणेशाय नमः ॥',
  telugu:     '॥ శ్రీ గణేశాయ నమః ॥',
  tamil:      '॥ ஸ்ரீ கணேசாய நமஃ ॥',
  kannada:    '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥',
  malayalam:  '॥ ശ്രീ ഗണേശായ നമഃ ॥',
  bengali:    '॥ শ্রী গণেশায় নমঃ ॥',
  gujarati:   '॥ શ્રી ગણેશાય નમઃ ॥',
  marathi:    '॥ श्री गणेशाय नमः ॥',
  odia:       '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥',
  punjabi:    '॥ ਸ਼੍ਰੀ ਗਣੇਸ਼ਾਯ ਨਮਃ ॥',
}
const DEFAULT_SLOGAN = '॥ श्री गणेशाय नमः ॥'

const RELIGION_SLOGANS = {
  muslim:    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  sikh:      'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ',
  christian: '✝ To God Be The Glory ✝',
  jain:      '॥ जय जिनेन्द्र ॥',
  buddhist:  '॥ नमो बुद्धाय ॥',
}

function getReligionKey(religion) {
  const r = (religion || '').toLowerCase().trim()
  if (r.includes('muslim') || r.includes('islam')) return 'muslim'
  if (r.includes('sikh'))                           return 'sikh'
  if (r.includes('christian') || r.includes('catholic') || r.includes('protestant')) return 'christian'
  if (r.includes('jain'))                           return 'jain'
  if (r.includes('buddhist') || r.includes('buddhism')) return 'buddhist'
  if (r.includes('hindu'))                          return 'hindu'
  return null
}

function getSlogan(religion, motherTongue, sloganLanguage = 'auto') {
  if (sloganLanguage === 'hide') return null
  // Religion is always checked first — non-Hindu users never get a Ganesh slogan
  const relKey = getReligionKey(religion)
  if (!relKey) return null
  if (relKey !== 'hindu') return RELIGION_SLOGANS[relKey] || null
  // Hindu: respect language override, fallback to mother tongue
  const key = (sloganLanguage === 'auto')
    ? (motherTongue || '').toLowerCase().trim()
    : sloganLanguage
  return HINDU_SLOGANS[key] || DEFAULT_SLOGAN
}

/* ═══════════════════════════════════════════
   BORDER COMPONENTS
   Each receives { outer, gold } and renders
   the full decorative border layer.
═══════════════════════════════════════════ */

/* 1 ── Lotus — classic maroon & gold, 4-arm lotus at corners */
function LotusBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <ellipse cx="18" cy="18" rx="6" ry="13" fill={gold} fillOpacity="0.18" transform="rotate(0,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" stroke={gold} strokeWidth="0.8" transform="rotate(0,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" fill={gold} fillOpacity="0.18" transform="rotate(45,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" stroke={gold} strokeWidth="0.8" transform="rotate(45,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" fill={gold} fillOpacity="0.18" transform="rotate(90,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" stroke={gold} strokeWidth="0.8" transform="rotate(90,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" fill={gold} fillOpacity="0.18" transform="rotate(135,18,18)" />
        <ellipse cx="18" cy="18" rx="6" ry="13" stroke={gold} strokeWidth="0.8" transform="rotate(135,18,18)" />
        <circle cx="18" cy="18" r="4.5" fill={gold} />
        <circle cx="18" cy="18" r="2" fill={outer} />
        <path d="M29,18 Q40,12 51,17" stroke={gold} strokeWidth="0.9" />
        <path d="M18,29 Q12,40 17,51" stroke={gold} strokeWidth="0.9" />
        <ellipse cx="40" cy="12" rx="7" ry="2.5" fill={gold} fillOpacity="0.38" transform="rotate(-20,40,12)" />
        <ellipse cx="12" cy="40" rx="2.5" ry="7" fill={gold} fillOpacity="0.38" transform="rotate(20,12,40)" />
        <circle cx="51" cy="17" r="2.2" fill={gold} fillOpacity="0.75" />
        <circle cx="17" cy="51" r="2.2" fill={gold} fillOpacity="0.75" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2.5px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 11, right: 11, bottom: 11, left: 11, border: `1px solid ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 2 ── Art Deco — navy & muted gold, geometric L-brackets with tick marks */
function ArtDecoBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M 7 76 L 7 7 L 76 7" stroke={outer} strokeWidth="2" strokeLinecap="square" fill="none" />
        <path d="M 13 76 L 13 13 L 76 13" stroke={gold} strokeWidth="0.8" strokeLinecap="square" fill="none" />
        <rect x="3.5" y="3.5" width="7" height="7" transform="rotate(45 7 7)" fill={gold} />
        <rect x="32" y="4.5" width="5" height="5" transform="rotate(45 34.5 7)" fill={gold} fillOpacity="0.8" />
        <rect x="4.5" y="32" width="5" height="5" transform="rotate(45 7 34.5)" fill={gold} fillOpacity="0.8" />
        <line x1="24" y1="7" x2="24" y2="13" stroke={gold} strokeWidth="0.8" />
        <line x1="42" y1="7" x2="42" y2="13" stroke={gold} strokeWidth="0.8" />
        <line x1="58" y1="7" x2="58" y2="13" stroke={gold} strokeWidth="0.8" />
        <line x1="72" y1="7" x2="72" y2="13" stroke={gold} strokeWidth="0.8" />
        <line x1="7" y1="24" x2="13" y2="24" stroke={gold} strokeWidth="0.8" />
        <line x1="7" y1="42" x2="13" y2="42" stroke={gold} strokeWidth="0.8" />
        <line x1="7" y1="58" x2="13" y2="58" stroke={gold} strokeWidth="0.8" />
        <line x1="7" y1="72" x2="13" y2="72" stroke={gold} strokeWidth="0.8" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `1.5px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, left: 12, border: `0.5px solid ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 3 ── Floral Vine — forest green & warm gold, 8-petal flower + vine tendrils */
function FloralBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <ellipse key={a} cx="20" cy="20" rx="5" ry="11"
            fill={gold} fillOpacity="0.18" stroke={gold} strokeWidth="0.6"
            transform={`rotate(${a}, 20, 20)`} />
        ))}
        <circle cx="20" cy="20" r="4" fill={gold} />
        <circle cx="20" cy="20" r="1.8" fill={outer} />
        <path d="M 33 19 Q 48 12 62 17 Q 70 21 77 15" stroke={gold} strokeWidth="1" fill="none" />
        <path d="M 19 33 Q 12 48 17 62 Q 21 70 15 77" stroke={gold} strokeWidth="1" fill="none" />
        <ellipse cx="48" cy="14" rx="4.5" ry="2" fill={gold} fillOpacity="0.5" transform="rotate(-25, 48, 14)" />
        <ellipse cx="64" cy="17" rx="4.5" ry="2" fill={gold} fillOpacity="0.5" transform="rotate(15, 64, 17)" />
        <ellipse cx="14" cy="48" rx="2" ry="4.5" fill={gold} fillOpacity="0.5" transform="rotate(-25, 14, 48)" />
        <ellipse cx="17" cy="64" rx="2" ry="4.5" fill={gold} fillOpacity="0.5" transform="rotate(15, 17, 64)" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 11, right: 11, bottom: 11, left: 11, border: `0.8px solid ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 4 ── Peacock — teal & bright gold, feather-eye medallion + quill lines */
function PeacockBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* Feather barb rays */}
        <line x1="18" y1="18" x2="4"  y2="4"  stroke={gold} strokeWidth="0.7" opacity="0.5" />
        <line x1="18" y1="18" x2="10" y2="2"  stroke={gold} strokeWidth="0.7" opacity="0.5" />
        <line x1="18" y1="18" x2="2"  y2="10" stroke={gold} strokeWidth="0.7" opacity="0.5" />
        <line x1="18" y1="18" x2="18" y2="2"  stroke={gold} strokeWidth="0.6" opacity="0.4" />
        <line x1="18" y1="18" x2="2"  y2="18" stroke={gold} strokeWidth="0.6" opacity="0.4" />
        <line x1="18" y1="18" x2="28" y2="2"  stroke={gold} strokeWidth="0.5" opacity="0.3" />
        <line x1="18" y1="18" x2="2"  y2="28" stroke={gold} strokeWidth="0.5" opacity="0.3" />
        {/* Peacock eye rings */}
        <circle cx="18" cy="18" r="11" fill={outer} fillOpacity="0.08" stroke={outer} strokeWidth="0.8" />
        <circle cx="18" cy="18" r="7.5" fill={gold} fillOpacity="0.15" stroke={gold} strokeWidth="0.8" />
        <circle cx="18" cy="18" r="4.5" fill={outer} fillOpacity="0.5" stroke={outer} strokeWidth="0.6" />
        <circle cx="18" cy="18" r="2.2" fill={gold} />
        {/* Feather quills extending along edges */}
        <path d="M 30 13 Q 50 9  70 13" stroke={gold} strokeWidth="0.9" fill="none" />
        <path d="M 30 23 Q 50 27 70 23" stroke={gold} strokeWidth="0.9" fill="none" />
        <path d="M 13 30 Q 9  50 13 70" stroke={gold} strokeWidth="0.9" fill="none" />
        <path d="M 23 30 Q 27 50 23 70" stroke={gold} strokeWidth="0.9" fill="none" />
        {/* Small eye dots at mid-edge */}
        <circle cx="50" cy="11" r="3"   fill={outer} fillOpacity="0.4" stroke={outer} strokeWidth="0.4" />
        <circle cx="50" cy="11" r="1.5" fill={gold} />
        <circle cx="11" cy="50" r="3"   fill={outer} fillOpacity="0.4" stroke={outer} strokeWidth="0.4" />
        <circle cx="11" cy="50" r="1.5" fill={gold} />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 10, right: 10, bottom: 10, left: 10, border: `0.8px solid ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 5 ── Mandala — deep rust & orange-gold, 12-petal mandala medallion */
function MandalaBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* 12-petal outer ring */}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="19" cy="19" rx="3.5" ry="9"
            fill={gold} fillOpacity="0.15" stroke={gold} strokeWidth="0.5"
            transform={`rotate(${i * 30}, 19, 19)`} />
        ))}
        {/* Middle ring */}
        <circle cx="19" cy="19" r="8" stroke={gold} strokeWidth="0.7" fill="none" />
        {/* 8 inner accent dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <circle key={a}
            cx={19 + 5.5 * Math.cos(a * Math.PI / 180)}
            cy={19 + 5.5 * Math.sin(a * Math.PI / 180)}
            r="1.2" fill={gold} fillOpacity="0.9" />
        ))}
        {/* Center */}
        <circle cx="19" cy="19" r="3.5" fill={gold} />
        <circle cx="19" cy="19" r="1.5" fill={outer} />
        {/* Diamond accents along each arm */}
        <rect x="34" y="5"  width="5" height="5" transform="rotate(45 36.5 7.5)"  fill={gold} fillOpacity="0.75" />
        <rect x="56" y="5"  width="5" height="5" transform="rotate(45 58.5 7.5)"  fill={gold} fillOpacity="0.5"  />
        <rect x="5"  y="34" width="5" height="5" transform="rotate(45 7.5 36.5)"  fill={gold} fillOpacity="0.75" />
        <rect x="5"  y="56" width="5" height="5" transform="rotate(45 7.5 58.5)"  fill={gold} fillOpacity="0.5"  />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, left: 12, borderTop: `0.8px dashed ${gold}`, borderBottom: `0.8px dashed ${gold}`, borderLeft: `0.8px dashed ${gold}`, borderRight: `0.8px dashed ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 6 ── Celestial — midnight indigo & lavender, 8-pointed star burst + constellation dots */
function CelestialBorder({ outer, gold }) {
  function Corner() {
    const starPoints = Array.from({ length: 8 }, (_, i) => {
      const a = (i * 45 - 90) * Math.PI / 180
      const r = i % 2 === 0 ? 13 : 7
      return `${(18 + r * Math.cos(a)).toFixed(2)},${(18 + r * Math.sin(a)).toFixed(2)}`
    }).join(' ')
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* Star burst rays */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * 22.5) * Math.PI / 180
          return (
            <line key={i} x1="18" y1="18"
              x2={(18 + 17 * Math.cos(a)).toFixed(2)}
              y2={(18 + 17 * Math.sin(a)).toFixed(2)}
              stroke={gold} strokeWidth="0.5" opacity="0.35" />
          )
        })}
        {/* 8-pointed star */}
        <polygon points={starPoints} fill={gold} fillOpacity="0.2" stroke={gold} strokeWidth="0.8" />
        {/* Halo ring */}
        <circle cx="18" cy="18" r="5.5" fill={gold} fillOpacity="0.25" stroke={gold} strokeWidth="0.7" />
        {/* Center */}
        <circle cx="18" cy="18" r="2.5" fill={gold} />
        <circle cx="18" cy="18" r="1"   fill={outer} />
        {/* Constellation dots along edges */}
        <circle cx="38" cy="8"  r="1.8" fill={gold} />
        <circle cx="54" cy="6"  r="1.1" fill={gold} opacity="0.65" />
        <circle cx="67" cy="8"  r="1.8" fill={gold} />
        <circle cx="8"  cy="38" r="1.8" fill={gold} />
        <circle cx="6"  cy="54" r="1.1" fill={gold} opacity="0.65" />
        <circle cx="8"  cy="67" r="1.8" fill={gold} />
        {/* Dotted connecting lines */}
        <path d="M 42 7 Q 50 5 58 7"  stroke={gold} strokeWidth="0.5" fill="none" opacity="0.45" />
        <path d="M 7 42 Q 5 50 7 58"  stroke={gold} strokeWidth="0.5" fill="none" opacity="0.45" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 5, right: 5, bottom: 5, left: 5, border: `2px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 11, right: 11, bottom: 11, left: 11, borderTop: `0.5px dashed ${gold}`, borderBottom: `0.5px dashed ${gold}`, borderLeft: `0.5px dashed ${gold}`, borderRight: `0.5px dashed ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 7 ── Bridal — deep crimson & pearl gold, ornate scallop medallion + curved flourish arms */
function BridalBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* Outer scallop ring — 12 circles */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30) * Math.PI / 180
          return (
            <circle key={i}
              cx={(18 + 13 * Math.cos(a)).toFixed(2)}
              cy={(18 + 13 * Math.sin(a)).toFixed(2)}
              r="3.2" fill={gold} fillOpacity="0.2" stroke={gold} strokeWidth="0.5" />
          )
        })}
        {/* Middle dashed ring */}
        <circle cx="18" cy="18" r="8.5" stroke={gold} strokeWidth="0.9" fill="none" strokeDasharray="3 2" />
        {/* Inner filled ring */}
        <circle cx="18" cy="18" r="5.5" fill={gold} fillOpacity="0.2" stroke={gold} strokeWidth="0.8" />
        {/* Center */}
        <circle cx="18" cy="18" r="3"   fill={gold} />
        <circle cx="18" cy="18" r="1.2" fill={outer} />
        {/* Curved flourish arms */}
        <path d="M 30 14 C 44 11 58 11 73 13" stroke={gold} strokeWidth="1"   fill="none" />
        <path d="M 30 22 C 44 25 58 25 73 23" stroke={gold} strokeWidth="1"   fill="none" />
        <path d="M 14 30 C 11 44 11 58 13 73" stroke={gold} strokeWidth="1"   fill="none" />
        <path d="M 22 30 C 25 44 25 58 23 73" stroke={gold} strokeWidth="1"   fill="none" />
        {/* Flourish accent dots */}
        <circle cx="50" cy="12" r="1.8" fill={gold} fillOpacity="0.85" />
        <circle cx="68" cy="13" r="1.8" fill={gold} fillOpacity="0.85" />
        <circle cx="12" cy="50" r="1.8" fill={gold} fillOpacity="0.85" />
        <circle cx="13" cy="68" r="1.8" fill={gold} fillOpacity="0.85" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2.5px solid ${outer}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 11, right: 11, bottom: 11, left: 11, border: `1px solid ${gold}`, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 8 ── Minimal — warm slate & caramel, whisper-thin frame, understated corner hooks */
function MinimalBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M 3 26 L 3 3 L 26 3" stroke={outer} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="3" cy="3" r="2.8" fill={gold} />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 12, right: 12, bottom: 12, left: 12, border: `0.7px solid ${outer}`, opacity: 0.28, pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 9 ── Royal — deep indigo & bright gold, triple-frame with jewelled corner medallions */
function RoyalBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        {/* Triple nested L-frame */}
        <path d="M 5 82 L 5 5 L 82 5"  stroke={outer} strokeWidth="2.5" fill="none" />
        <path d="M 11 82 L 11 11 L 82 11" stroke={gold}  strokeWidth="1"   fill="none" />
        <path d="M 16 82 L 16 16 L 82 16" stroke={outer} strokeWidth="0.5" fill="none" opacity="0.4" />
        {/* Jewelled corner medallion */}
        <circle cx="8" cy="8" r="6.5" fill={outer} fillOpacity="0.12" stroke={gold} strokeWidth="0.8" />
        <rect x="4.5" y="4.5" width="7" height="7" transform="rotate(45 8 8)" fill={gold} />
        <circle cx="8" cy="8" r="2" fill={outer} />
        {/* Gold bead chain along arms */}
        <circle cx="30" cy="8"  r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        <circle cx="50" cy="8"  r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        <circle cx="70" cy="8"  r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        <circle cx="8"  cy="30" r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        <circle cx="8"  cy="50" r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        <circle cx="8"  cy="70" r="2.5" fill={gold} fillOpacity="0.8" stroke={outer} strokeWidth="0.4" />
        {/* Diamond links between beads */}
        <rect x="37" y="5.5" width="5" height="5" transform="rotate(45 39.5 8)"  fill={gold} fillOpacity="0.55" />
        <rect x="57" y="5.5" width="5" height="5" transform="rotate(45 59.5 8)"  fill={gold} fillOpacity="0.55" />
        <rect x="5.5" y="37" width="5" height="5" transform="rotate(45 8 39.5)"  fill={gold} fillOpacity="0.55" />
        <rect x="5.5" y="57" width="5" height="5" transform="rotate(45 8 59.5)"  fill={gold} fillOpacity="0.55" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 10 ── Modern — deep teal & vivid cyan, bold viewfinder corners, no full border */
function ModernBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        {/* Bold L-bracket */}
        <path d="M 6 44 L 6 6 L 44 6" stroke={outer} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Thin accent inside */}
        <path d="M 14 44 L 14 14 L 44 14" stroke={gold} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Filled square at corner junction */}
        <rect x="2" y="2" width="9" height="9" rx="1" fill={gold} />
        {/* Far-end accent dots */}
        <circle cx="55" cy="9.5" r="3" fill={gold} fillOpacity="0.55" />
        <circle cx="9.5" cy="55" r="3" fill={gold} fillOpacity="0.55" />
        {/* Mid-arm tick */}
        <line x1="28" y1="6" x2="28" y2="14" stroke={gold} strokeWidth="1.2" />
        <line x1="6"  y1="28" x2="14" y2="28" stroke={gold} strokeWidth="1.2" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 11 ── Amethyst — deep violet & luminous lavender-gold, cascading diamond lattice */
function AmethystBorder({ outer, gold }) {
  const diamonds = [[14,14,0.95],[28,14,0.6],[42,14,0.35],[14,28,0.6],[28,28,0.35],[14,42,0.35]]
  function Corner() {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        {diamonds.map(([cx, cy, op], i) => (
          <rect key={i} x={cx - 5} y={cy - 5} width="10" height="10"
            transform={`rotate(45 ${cx} ${cy})`}
            fill={gold} fillOpacity={op} stroke={outer} strokeWidth="0.5" />
        ))}
        <line x1="14" y1="14" x2="14" y2="42" stroke={gold} strokeWidth="0.5" opacity="0.4" />
        <line x1="14" y1="14" x2="42" y2="14" stroke={gold} strokeWidth="0.5" opacity="0.4" />
        <path d="M 5 70 L 5 5 L 70 5"  stroke={outer} strokeWidth="1.8" fill="none" />
        <path d="M 10 70 L 10 10 L 70 10" stroke={gold} strokeWidth="0.6" fill="none" opacity="0.5" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 12 ── Ember — burnt sienna & flame orange, concentric sunrise arcs */
function EmberBorder({ outer, gold }) {
  const radii = [52, 44, 36, 28]
  function Corner() {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        {/* Concentric arc fans from corner */}
        {radii.map((r, i) => (
          <path key={r} d={`M 0 ${r} A ${r} ${r} 0 0 1 ${r} 0`}
            stroke={i === 0 ? outer : gold}
            strokeWidth={i === 0 ? 2.5 : i === 1 ? 1.2 : 0.6}
            fill="none" opacity={i > 1 ? 0.55 : 1} />
        ))}
        {/* Radiating spokes */}
        {[18, 32, 45, 58].map((deg, i) => {
          const a = deg * Math.PI / 180
          return <line key={i} x1="0" y1="0"
            x2={(56 * Math.cos(a)).toFixed(1)} y2={(56 * Math.sin(a)).toFixed(1)}
            stroke={gold} strokeWidth="0.5" opacity="0.22" />
        })}
        <circle cx="0" cy="0" r="7" fill={outer} />
        <circle cx="0" cy="0" r="4" fill={gold} />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 13 ── Rose — deep rose & blush, scattered petal corners with delicate vine stems */
function RoseBorder({ outer, gold }) {
  const petals = [[14,14,0],[22,10,35],[10,22,-35],[28,20,65],[20,28,-65],[36,12,20],[12,36,-20]]
  function Corner() {
    return (
      <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
        {petals.map(([cx, cy, rot], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="4.5" ry="8"
            fill={gold} fillOpacity={i === 0 ? 0.55 : 0.2}
            stroke={gold} strokeWidth={i === 0 ? 0.8 : 0.4}
            transform={`rotate(${rot}, ${cx}, ${cy})`} />
        ))}
        <circle cx="14" cy="14" r="4" fill={gold} />
        <circle cx="14" cy="14" r="1.8" fill={outer} />
        <path d="M 28 12 Q 48 8  68 12" stroke={gold} strokeWidth="0.9" fill="none" />
        <path d="M 12 28 Q 8  48 12 68" stroke={gold} strokeWidth="0.9" fill="none" />
        <ellipse cx="48" cy="10" rx="4" ry="2" fill={gold} fillOpacity="0.45" transform="rotate(-20,48,10)" />
        <ellipse cx="66" cy="12" rx="4" ry="2" fill={gold} fillOpacity="0.45" transform="rotate(15,66,12)" />
        <ellipse cx="10" cy="48" rx="2" ry="4" fill={gold} fillOpacity="0.45" transform="rotate(-20,10,48)" />
        <ellipse cx="12" cy="66" rx="2" ry="4" fill={gold} fillOpacity="0.45" transform="rotate(15,12,66)" />
        <path d="M 5 74 L 5 5 L 74 5"  stroke={outer} strokeWidth="2"   fill="none" />
        <path d="M 10 74 L 10 10 L 74 10" stroke={gold} strokeWidth="0.7" fill="none" opacity="0.5" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* 14 ── Midnight — near-black & electric blue, circuit board corners */
function MidnightBorder({ outer, gold }) {
  function Corner() {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <path d="M 8 66 L 8 8 L 66 8" stroke={outer} strokeWidth="3" strokeLinecap="square" fill="none" />
        {/* Circuit branch traces */}
        <path d="M 8 26 L 22 26 L 22 18"  stroke={gold} strokeWidth="1.2" strokeLinecap="square" fill="none" />
        <path d="M 8 44 L 28 44 L 28 34"  stroke={gold} strokeWidth="1.2" strokeLinecap="square" fill="none" opacity="0.65" />
        <path d="M 26 8 L 26 22 L 18 22"  stroke={gold} strokeWidth="1.2" strokeLinecap="square" fill="none" />
        <path d="M 44 8 L 44 28 L 34 28"  stroke={gold} strokeWidth="1.2" strokeLinecap="square" fill="none" opacity="0.65" />
        {/* Corner chip */}
        <rect x="3" y="3" width="11" height="11" fill={outer} />
        <rect x="5.5" y="5.5" width="6" height="6" fill={gold} />
        {/* Node pads */}
        <circle cx="22" cy="18" r="3"   fill={gold} />
        <circle cx="18" cy="22" r="3"   fill={gold} />
        <circle cx="28" cy="34" r="2.5" fill={gold} opacity="0.75" />
        <circle cx="34" cy="28" r="2.5" fill={gold} opacity="0.75" />
        <path d="M 14 66 L 14 14 L 66 14" stroke={gold} strokeWidth="0.5" fill="none" opacity="0.35" />
      </svg>
    )
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><Corner /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><Corner /></div>
    </>
  )
}

/* ═══════════════════════════════════════════
   THEME CATALOGUE
   Maps data.template → colors + border style
═══════════════════════════════════════════ */
export const THEMES = {
  lotus:      { outer: '#6B0F1A', gold: '#C9A035', label: '#7B2D2D', value: '#1C0808', bg: '#FDFDF9', Border: LotusBorder    },
  artDeco:    { outer: '#1B2A4A', gold: '#BFA060', label: '#243A5C', value: '#0A1428', bg: '#F7F8FD', Border: ArtDecoBorder   },
  floralVine: { outer: '#2A4A1C', gold: '#C8A020', label: '#3A5A28', value: '#0C1A08', bg: '#F6FBF3', Border: FloralBorder    },
  peacock:    { outer: '#0D4A5E', gold: '#F0B840', label: '#0E3A4E', value: '#04141E', bg: '#F2FAFB', Border: PeacockBorder   },
  mandala:    { outer: '#7A1A10', gold: '#E07830', label: '#8A2A18', value: '#280806', bg: '#FDF5F0', Border: MandalaBorder   },
  celestial:  { outer: '#1E0850', gold: '#A888E0', label: '#2A1060', value: '#0C0420', bg: '#F8F4FF', Border: CelestialBorder },
  bridal:     { outer: '#720A20', gold: '#D4BC90', label: '#820C28', value: '#1E0408', bg: '#FDF8F2', Border: BridalBorder    },
  minimal:    { outer: '#4A4540', gold: '#9B8B7A', label: '#5A5050', value: '#1A1512', bg: '#FDFCFA', Border: MinimalBorder   },
  royal:      { outer: '#1A0A3A', gold: '#D4A820', label: '#2A1850', value: '#0A0420', bg: '#F7F5FF', Border: RoyalBorder     },
  modern:     { outer: '#0D3D30', gold: '#00B894', label: '#1A5040', value: '#041A14', bg: '#F0FAFA', Border: ModernBorder    },
  amethyst:   { outer: '#4A0A78', gold: '#C070E8', label: '#5A1888', value: '#180428', bg: '#FAF5FF', Border: AmethystBorder  },
  ember:      { outer: '#7A2C08', gold: '#F07030', label: '#8A3C14', value: '#280C04', bg: '#FFF8F2', Border: EmberBorder     },
  rose:       { outer: '#7A1040', gold: '#E898A0', label: '#8A2050', value: '#280814', bg: '#FFF5F8', Border: RoseBorder      },
  midnight:   { outer: '#080818', gold: '#4880E0', label: '#181828', value: '#040410', bg: '#F5F5FF', Border: MidnightBorder  },
}

/* ═══════════════════════════════════════════
   MAIN TEMPLATE COMPONENT
═══════════════════════════════════════════ */
export default function PanIndiaTemplate({ data }) {
  const { t } = useLanguage()
  const theme = THEMES[data?.template] || THEMES.lotus
  const { outer, gold, label: labelColor, value: valueColor, bg, Border } = theme

  const {
    fullName, gender, dateOfBirth, age, height, weight, bloodGroup,
    religion, caste, subCaste, motherTongue,
    education, college, occupation, company, income, workLocation,
    fatherName, fatherOccupation, motherName, motherOccupation,
    brothers, sisters, familyType, familyStatus, nativePlace,
    hobbies, about,
    rashi, nakshatra, gotra, manglik,
    address, city, state, phone, email,
    photo, photoPosition = { x: 50, y: 20 },
    sloganLanguage = 'auto',
    customFields = [],
  } = data

  const clean = customFields.filter(f => f.label?.trim() && f.value?.trim())
  const bySection = s => clean.filter(f => f.section === s)
  const grouped = bySection('custom').reduce((acc, f) => {
    const t = f.customTitle?.trim() || 'Additional Details'
    return { ...acc, [t]: [...(acc[t] || []), f] }
  }, {})
  const hasHoroscope = rashi || nakshatra || gotra ||
    (manglik && manglik !== 'No') || bySection('horoscope').length > 0

  /* Row and Divider close over theme colors */
  function Divider({ title }) {
    return (
      <div data-pdf-divider="true" style={{ margin: '20px 0 6px' }}>
        <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: outer }}>
          {title}
        </span>
      </div>
    )
  }

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '4px 0' }}>
        <span style={{ width: 148, flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: labelColor }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: gold, marginRight: 10 }}>:</span>
        <span style={{ fontSize: 10.5, color: valueColor, fontWeight: 500, flex: 1, lineHeight: 1.5 }}>{value}</span>
      </div>
    )
  }

  return (
    <div className="pdf-area" style={{ background: bg, fontFamily: 'Inter, sans-serif', position: 'relative' }}>

      <Border outer={outer} gold={gold} />

      <div style={{ padding: '48px 52px 28px 90px', position: 'relative', zIndex: 1 }}>

        {getSlogan(religion, motherTongue, sloganLanguage) && (
          <header style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'serif', fontSize: 13, color: gold, letterSpacing: '0.14em' }}>
              {getSlogan(religion, motherTongue, sloganLanguage)}
            </div>
          </header>
        )}

        {/* Personal Details */}
        <Divider title={t('pdf_personal')} />
        <div style={{ display: 'grid', gridTemplateColumns: photo ? '1fr 160px' : '1fr', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <Row label={t('pdf_name')}       value={fullName} />
            <Row label={t('pdf_dob')}        value={formatDate(dateOfBirth)} />
            <Row label={t('pdf_age')}        value={age ? `${age} Years` : null} />
            <Row label={t('pdf_height')}     value={height} />
            <Row label={t('pdf_weight')}     value={weight} />
            <Row label={t('pdf_blood')}      value={bloodGroup} />
            <Row label={t('pdf_religion')}   value={religion} />
            <Row label={t('pdf_community')}  value={[caste, subCaste].filter(Boolean).join(' / ')} />
            <Row label={t('pdf_tongue')}     value={motherTongue} />
            <Row label={t('pdf_gender')}     value={gender} />
            {bySection('personal').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
            <Row label={t('pdf_education')}  value={education} />
            <Row label={t('pdf_college')}    value={college} />
            <Row label={t('pdf_occupation')} value={occupation} />
            <Row label={t('pdf_org')}        value={company} />
            <Row label={t('pdf_income')}     value={income} />
            <Row label={t('pdf_work')}       value={workLocation} />
            {bySection('career').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
          {photo && (
            <div style={{
              width: 152, height: 192,
              backgroundImage: `url(${photo})`,
              backgroundSize: 'cover',
              backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
              backgroundRepeat: 'no-repeat',
            }} />
          )}
        </div>

        {/* Family Details */}
        <Divider title={t('pdf_family')} />
        <Row label={t('pdf_father')}        value={fatherName && fatherOccupation ? `${fatherName} (${fatherOccupation})` : fatherName || fatherOccupation} />
        <Row label={t('pdf_mother')}        value={motherName && motherOccupation ? `${motherName} (${motherOccupation})` : motherName || motherOccupation} />
        <Row label={t('pdf_brothers')}      value={brothers} />
        <Row label={t('pdf_sisters')}       value={sisters} />
        <Row label={t('pdf_family_type')}   value={familyType} />
        <Row label={t('pdf_family_status')} value={familyStatus} />
        <Row label={t('pdf_native')}        value={nativePlace} />
        {bySection('family').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        {hasHoroscope && (
          <>
            <Row label={t('pdf_rashi')}     value={rashi} />
            <Row label={t('pdf_nakshatra')} value={nakshatra} />
            <Row label={t('pdf_gotra')}     value={gotra} />
            <Row label={t('pdf_manglik')}   value={manglik} />
            {bySection('horoscope').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </>
        )}

        {/* Contact & About */}
        <Divider title={t('pdf_contact')} />
        <Row label={t('pdf_phone')}    value={phone} />
        <Row label={t('pdf_email')}    value={email} />
        <Row label="City / State"      value={[city, state].filter(Boolean).join(', ')} />
        <Row label={t('pdf_address')}  value={address} />
        {bySection('contact').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        <Row label={t('pdf_hobbies')}  value={hobbies} />
        <Row label={t('pdf_about')}    value={about} />

        {/* Custom sections */}
        {Object.entries(grouped).map(([title, rows]) => (
          <div key={title}>
            <Divider title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        {/* Footer ornament */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill={gold}>
            <rect x="3.5" y="3.5" width="7" height="7" transform="rotate(45 7 7)" />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
        </div>

      </div>
    </div>
  )
}
