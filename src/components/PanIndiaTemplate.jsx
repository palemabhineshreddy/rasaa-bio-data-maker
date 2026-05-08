import { formatDate } from '../utils/formatters'

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

function getSlogan(religion, motherTongue, sloganLanguage = 'auto') {
  if (sloganLanguage === 'hide') return null
  if (sloganLanguage !== 'auto') return HINDU_SLOGANS[sloganLanguage] || DEFAULT_SLOGAN
  if (!religion || religion.toLowerCase() !== 'hindu') return null
  const key = (motherTongue || '').toLowerCase().trim()
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

/* ═══════════════════════════════════════════
   THEME CATALOGUE
   Maps data.template → colors + border style
═══════════════════════════════════════════ */
export const THEMES = {
  panIndia:   { outer: '#6B0F1A', gold: '#C9A035', label: '#7B2D2D', value: '#1C0808', bg: '#FDFDF9', Border: LotusBorder    },
  artDeco:    { outer: '#1B2A4A', gold: '#BFA060', label: '#243A5C', value: '#0A1428', bg: '#F7F8FD', Border: ArtDecoBorder   },
  floralVine: { outer: '#2A4A1C', gold: '#C8A020', label: '#3A5A28', value: '#0C1A08', bg: '#F6FBF3', Border: FloralBorder    },
  peacock:    { outer: '#0D4A5E', gold: '#F0B840', label: '#0E3A4E', value: '#04141E', bg: '#F2FAFB', Border: PeacockBorder   },
  mandala:    { outer: '#7A1A10', gold: '#E07830', label: '#8A2A18', value: '#280806', bg: '#FDF5F0', Border: MandalaBorder   },
  celestial:  { outer: '#1E0850', gold: '#A888E0', label: '#2A1060', value: '#0C0420', bg: '#F8F4FF', Border: CelestialBorder },
  bridal:     { outer: '#720A20', gold: '#D4BC90', label: '#820C28', value: '#1E0408', bg: '#FDF8F2', Border: BridalBorder    },
}

/* ═══════════════════════════════════════════
   MAIN TEMPLATE COMPONENT
═══════════════════════════════════════════ */
export default function PanIndiaTemplate({ data }) {
  const theme = THEMES[data?.template] || THEMES.panIndia
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

      <div style={{ padding: '48px 52px 28px 52px', position: 'relative', zIndex: 1 }}>

        {getSlogan(religion, motherTongue, sloganLanguage) && (
          <header style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'serif', fontSize: 13, color: gold, letterSpacing: '0.14em' }}>
              {getSlogan(religion, motherTongue, sloganLanguage)}
            </div>
          </header>
        )}

        {/* Personal Details */}
        <Divider title="Personal Details" />
        <div style={{ display: 'grid', gridTemplateColumns: photo ? '1fr 160px' : '1fr', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <Row label="Name"                 value={fullName} />
            <Row label="Date of Birth"        value={formatDate(dateOfBirth)} />
            <Row label="Age"                  value={age ? `${age} Years` : null} />
            <Row label="Height"               value={height} />
            <Row label="Weight"               value={weight} />
            <Row label="Blood Group"          value={bloodGroup} />
            <Row label="Religion"             value={religion} />
            <Row label="Community"            value={[caste, subCaste].filter(Boolean).join(' / ')} />
            <Row label="Mother Tongue"        value={motherTongue} />
            <Row label="Gender"               value={gender} />
            {bySection('personal').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
            <Row label="Education"            value={education} />
            <Row label="College / University" value={college} />
            <Row label="Occupation"           value={occupation} />
            <Row label="Organisation"         value={company} />
            <Row label="Annual Income"        value={income} />
            <Row label="Work Location"        value={workLocation} />
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
        <Divider title="Family Details" />
        <Row label="Father"        value={fatherName && fatherOccupation ? `${fatherName} (${fatherOccupation})` : fatherName || fatherOccupation} />
        <Row label="Mother"        value={motherName && motherOccupation ? `${motherName} (${motherOccupation})` : motherName || motherOccupation} />
        <Row label="Brothers"      value={brothers} />
        <Row label="Sisters"       value={sisters} />
        <Row label="Family Type"   value={familyType} />
        <Row label="Family Status" value={familyStatus} />
        <Row label="Native Place"  value={nativePlace} />
        {bySection('family').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        {hasHoroscope && (
          <>
            <Row label="Rashi"     value={rashi} />
            <Row label="Nakshatra" value={nakshatra} />
            <Row label="Gotra"     value={gotra} />
            <Row label="Manglik"   value={manglik} />
            {bySection('horoscope').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </>
        )}

        {/* Contact & About */}
        <Divider title="Contact & About" />
        <Row label="Phone"               value={phone} />
        <Row label="Email"               value={email} />
        <Row label="City / State"        value={[city, state].filter(Boolean).join(', ')} />
        <Row label="Address"             value={address} />
        {bySection('contact').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        <Row label="Interests & Hobbies" value={hobbies} />
        <Row label="About Me"            value={about} />

        {/* Custom sections */}
        {Object.entries(grouped).map(([title, rows]) => (
          <div key={title}>
            <Divider title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 5 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill={gold}>
              <rect x="3.5" y="3.5" width="7" height="7" transform="rotate(45 7 7)" />
            </svg>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
          </div>
          <div style={{ fontSize: 8, color: gold, opacity: 0.7, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Created with Bandhan · bandhan.app
          </div>
        </div>

      </div>
    </div>
  )
}
