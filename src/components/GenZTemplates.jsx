import { formatDate } from '../utils/formatters'
import { useLanguage } from '../contexts/LanguageContext'

// ─── Shared row extractor ────────────────────────────────────────────────────

function extractRows(data) {
  const {
    fullName, dateOfBirth, age, gender, height, weight, bloodGroup,
    religion, caste, subCaste, motherTongue,
    education, college, occupation, company, income, workLocation,
    fatherName, fatherOccupation, motherName, motherOccupation,
    brothers, sisters, familyType, familyStatus, nativePlace,
    about, partnerExpectations, rashi, nakshatra, gotra, manglik,
    address, city, state, phone, email,
    customFields = [],
  } = data

  const clean = (Array.isArray(customFields) ? customFields : []).filter(f => f.label?.trim() && f.value?.trim())
  const bySec = s => clean.filter(f => f.section === s)
  const hasHoroscope = rashi || nakshatra || gotra || (manglik && manglik !== 'No') || bySec('horoscope').length > 0

  const customGrouped = bySec('custom').reduce((acc, f) => {
    const t = f.customTitle?.trim() || 'Additional Details'
    return { ...acc, [t]: [...(acc[t] || []), f] }
  }, {})

  const personal = [
    ['Name', fullName],
    ['Date of Birth', formatDate(dateOfBirth)],
    ['Age', age ? `${age} Years` : null],
    ['Height', height], ['Weight', weight], ['Blood Group', bloodGroup],
    ['Religion', religion],
    ['Community', [caste, subCaste].filter(Boolean).join(' / ') || null],
    ['Mother Tongue', motherTongue], ['Gender', gender],
    ...bySec('personal').map(f => [f.label, f.value]),
    ['About Me', about],
    ['Partner Expectations', partnerExpectations],
    ['Education', education], ['College / University', college],
    ['Occupation', occupation], ['Organisation', company],
    ['Annual Income', income], ['Work Location', workLocation],
    ...bySec('career').map(f => [f.label, f.value]),
  ].filter(([, v]) => v)

  const family = [
    ['Father', fatherName && fatherOccupation
      ? `${fatherName} (${fatherOccupation})`
      : (fatherName || fatherOccupation)],
    ['Mother', motherName && motherOccupation
      ? `${motherName} (${motherOccupation})`
      : (motherName || motherOccupation)],
    ['Brothers', brothers], ['Sisters', sisters],
    ['Family Type', familyType], ['Family Status', familyStatus],
    ['Native Place', nativePlace],
    ...bySec('family').map(f => [f.label, f.value]),
    ...(hasHoroscope ? [
      ['Rashi', rashi], ['Nakshatra', nakshatra],
      ['Gotra', gotra], ['Manglik', manglik],
      ...bySec('horoscope').map(f => [f.label, f.value]),
    ] : []),
  ].filter(([, v]) => v)

  const contact = [
    ['Phone', phone], ['Email', email],
    ['City / State', [city, state].filter(Boolean).join(', ') || null],
    ['Address', address],
    ...bySec('contact').map(f => [f.label, f.value]),
  ].filter(([, v]) => v)

  return { personal, family, contact, customGrouped }
}

// ─── 1. NOIR ─────────────────────────────────────────────────────────────────
// Dark luxury: near-black bg, amber accents, no ornamental border decoration

export function NoirTemplate({ data }) {
  const { t } = useLanguage()
  const { photo, photoPosition = { x: 50, y: 20 }, occupation, city } = data || {}
  const { personal, family, contact, customGrouped } = extractRows(data || {})

  const AMBER  = '#e8a820'
  const BG     = '#0c0c0c'
  const LABEL  = '#777777'
  const VALUE  = '#d4d4d4'
  const WHITE  = '#f8f8f8'

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '3.5px 0' }}>
        <span style={{ width: 145, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: LABEL, letterSpacing: '0.01em' }}>
          {label}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: AMBER, marginRight: 10, flexShrink: 0 }}>:</span>
        <span style={{ fontSize: 10.5, color: VALUE, fontWeight: 400, flex: 1, lineHeight: 1.55 }}>{value}</span>
      </div>
    )
  }

  function Section({ titleKey, title }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 8px' }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: AMBER, flexShrink: 0 }}>
          {titleKey ? t(titleKey) : title}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(232,168,32,0.22)' }} />
      </div>
    )
  }

  const subtitle = [occupation, city].filter(Boolean).join(' · ')

  return (
    <div className="pdf-area" style={{ background: BG, fontFamily: 'Inter, sans-serif', position: 'relative', minHeight: '100%' }}>
      {/* Amber top accent */}
      <div style={{ height: 3, backgroundImage: `linear-gradient(90deg, ${AMBER} 0%, rgba(232,168,32,0) 100%)`, backgroundRepeat: 'no-repeat' }} />

      <div style={{ padding: '42px 52px 32px 52px' }}>
        {/* Name block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 38, fontWeight: 800, color: WHITE, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {data?.fullName || 'Your Name'}
            </div>
            {subtitle && (
              <div style={{ fontSize: 13, color: '#888888', letterSpacing: '0.03em', marginTop: 8 }}>{subtitle}</div>
            )}
            <div style={{ width: 48, height: 2, background: AMBER, marginTop: 14, borderRadius: 1 }} />
          </div>

          {photo && (
            <div style={{
              width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
              backgroundImage: `url(${photo})`,
              backgroundSize: 'cover',
              backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              border: `2px solid ${AMBER}`,
              boxShadow: '0 0 0 5px rgba(232,168,32,0.1)',
            }} />
          )}
        </div>

        <Section titleKey="pdf_personal" />
        {personal.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_family" />
        {family.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_contact" />
        {contact.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        {Object.entries(customGrouped).map(([title, rows]) => (
          <div key={title}>
            <Section title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        <div style={{ marginTop: 26, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  )
}

// ─── 2. AURORA ───────────────────────────────────────────────────────────────
// Deep space gradient, glowing cyan accents, atmospheric orb blobs

export function AuroraTemplate({ data }) {
  const { t } = useLanguage()
  const { photo, photoPosition = { x: 50, y: 20 }, occupation, city } = data || {}
  const { personal, family, contact, customGrouped } = extractRows(data || {})

  const CYAN  = '#60d0ff'
  const WHITE = 'rgba(255,255,255,0.9)'
  const LABEL = 'rgba(255,255,255,0.5)'

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '3.5px 0' }}>
        <span style={{ width: 145, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: LABEL }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: CYAN, marginRight: 10, flexShrink: 0 }}>:</span>
        <span style={{ fontSize: 10.5, color: WHITE, fontWeight: 400, flex: 1, lineHeight: 1.55 }}>{value}</span>
      </div>
    )
  }

  function Section({ titleKey, title }) {
    return (
      <div style={{ margin: '18px 0 8px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: 9.5, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: CYAN,
          background: 'rgba(96,208,255,0.08)',
          border: '1px solid rgba(96,208,255,0.2)',
          padding: '4px 14px', borderRadius: 20,
        }}>
          {titleKey ? t(titleKey) : title}
        </span>
      </div>
    )
  }

  const subtitle = [occupation, city].filter(Boolean).join(' · ')

  return (
    <div className="pdf-area" style={{
      backgroundImage: 'linear-gradient(145deg, #1a0040 0%, #080c40 45%, #002840 100%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100%',
    }}>
      {/* Atmospheric orbs */}
      <div style={{
        position: 'absolute', top: -100, left: -60,
        width: 300, height: 300, borderRadius: '50%',
        backgroundImage: 'radial-gradient(circle, rgba(120,40,220,0.25) 0%, transparent 70%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -40,
        width: 280, height: 280, borderRadius: '50%',
        backgroundImage: 'radial-gradient(circle, rgba(0,120,180,0.2) 0%, transparent 70%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '44px 52px 32px 52px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {data?.fullName || 'Your Name'}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', marginTop: 7 }}>
                {subtitle}
              </div>
            )}
            <div style={{ width: 40, height: 1, background: CYAN, marginTop: 14, opacity: 0.5 }} />
          </div>

          {photo && (
            <div style={{
              width: 104, height: 104, borderRadius: '50%', flexShrink: 0,
              backgroundImage: `url(${photo})`,
              backgroundSize: 'cover',
              backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              border: '2px solid rgba(96,208,255,0.45)',
              boxShadow: '0 0 0 5px rgba(96,208,255,0.07), 0 0 28px rgba(96,208,255,0.18)',
            }} />
          )}
        </div>

        <Section titleKey="pdf_personal" />
        {personal.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_family" />
        {family.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_contact" />
        {contact.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        {Object.entries(customGrouped).map(([title, rows]) => (
          <div key={title}>
            <Section title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

      </div>
    </div>
  )
}

// ─── 3. EDITORIAL ────────────────────────────────────────────────────────────
// Bold magazine cover energy: deep navy header, vivid red accent, white content

export function EditorialTemplate({ data }) {
  const { t } = useLanguage()
  const { photo, photoPosition = { x: 50, y: 20 }, occupation, city } = data || {}
  const { personal, family, contact, customGrouped } = extractRows(data || {})

  const RED   = '#e5193c'
  const NAVY  = '#0f172a'
  const LABEL = '#9ca3af'
  const VALUE = '#111827'

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '3.5px 0' }}>
        <span style={{ width: 145, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: LABEL }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: RED, marginRight: 10, flexShrink: 0 }}>:</span>
        <span style={{ fontSize: 10.5, color: VALUE, fontWeight: 500, flex: 1, lineHeight: 1.55 }}>{value}</span>
      </div>
    )
  }

  function Section({ titleKey, title }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 7px' }}>
        <div style={{ width: 3, height: 14, background: RED, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: NAVY }}>
          {titleKey ? t(titleKey) : title}
        </span>
      </div>
    )
  }

  const subtitle = [occupation, city].filter(Boolean).join('  ·  ')

  return (
    <div className="pdf-area" style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif', minHeight: '100%' }}>
      {/* Header band */}
      <div style={{
        background: NAVY,
        padding: '28px 52px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
            {data?.fullName || 'Your Name'}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              {subtitle}
            </div>
          )}
          <div style={{ width: 48, height: 3, background: RED, marginTop: 12, borderRadius: 2 }} />
        </div>

        {photo && (
          <div style={{
            width: 108, height: 136, flexShrink: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
            backgroundRepeat: 'no-repeat',
            border: `3px solid ${RED}`,
          }} />
        )}
      </div>

      {/* Red accent stripe */}
      <div style={{ height: 3, background: RED }} />

      {/* Content */}
      <div style={{ padding: '28px 52px 32px' }}>
        <Section titleKey="pdf_personal" />
        {personal.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_family" />
        {family.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_contact" />
        {contact.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        {Object.entries(customGrouped).map(([title, rows]) => (
          <div key={title}>
            <Section title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        <div style={{ marginTop: 26, height: 1, background: '#e5e7eb' }} />
      </div>
    </div>
  )
}

// ─── 4. BLOOM ────────────────────────────────────────────────────────────────
// Soft aesthetic: warm cream bg, vertical rose-to-violet accent bar, airy spacing

export function BloomTemplate({ data }) {
  const { t } = useLanguage()
  const { photo, photoPosition = { x: 50, y: 20 }, occupation, city } = data || {}
  const { personal, family, contact, customGrouped } = extractRows(data || {})

  const MAGENTA = '#c026d3'
  const INDIGO  = '#1e1b4b'
  const LABEL   = '#9c6e88'
  const VALUE   = '#2d1b3d'

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '3.5px 0' }}>
        <span style={{ width: 145, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: LABEL }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: MAGENTA, marginRight: 10, flexShrink: 0 }}>:</span>
        <span style={{ fontSize: 10.5, color: VALUE, fontWeight: 500, flex: 1, lineHeight: 1.55 }}>{value}</span>
      </div>
    )
  }

  function Section({ titleKey, title }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 7px' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: MAGENTA, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: MAGENTA }}>
          {titleKey ? t(titleKey) : title}
        </span>
      </div>
    )
  }

  const subtitle = [occupation, city].filter(Boolean).join(' · ')

  return (
    <div className="pdf-area" style={{ background: '#fdf6ef', fontFamily: 'Inter, sans-serif', display: 'flex', minHeight: '100%' }}>
      {/* Left vertical accent bar */}
      <div style={{
        width: 5, flexShrink: 0,
        backgroundImage: 'linear-gradient(180deg, #f9a8d4 0%, #c084fc 50%, #818cf8 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }} />

      {/* Main content */}
      <div style={{ flex: 1, padding: '42px 48px 32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: INDIGO, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {data?.fullName || 'Your Name'}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12, color: LABEL, letterSpacing: '0.02em', marginTop: 7 }}>{subtitle}</div>
            )}
            <div style={{ width: 40, height: 2, background: MAGENTA, marginTop: 12, borderRadius: 1, opacity: 0.6 }} />
          </div>

          {photo && (
            <div style={{
              width: 106, height: 130, flexShrink: 0,
              backgroundImage: `url(${photo})`,
              backgroundSize: 'cover',
              backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              borderRadius: 8,
              border: '2px solid rgba(192,38,211,0.3)',
              boxShadow: '0 8px 24px rgba(192,38,211,0.1)',
            }} />
          )}
        </div>

        <Section titleKey="pdf_personal" />
        {personal.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_family" />
        {family.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_contact" />
        {contact.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        {Object.entries(customGrouped).map(([title, rows]) => (
          <div key={title}>
            <Section title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

      </div>
    </div>
  )
}

// ─── 5. NEO ──────────────────────────────────────────────────────────────────
// Neo-brutalist: bold yellow header, thick black border, raw graphic confidence

export function NeoTemplate({ data }) {
  const { t } = useLanguage()
  const { photo, photoPosition = { x: 50, y: 20 }, occupation, city } = data || {}
  const { personal, family, contact, customGrouped } = extractRows(data || {})

  const YELLOW = '#ffe033'
  const BLACK  = '#0a0a0a'
  const LABEL  = '#666666'
  const VALUE  = '#0a0a0a'

  function Row({ label, value }) {
    if (!value) return null
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', padding: '3.5px 0' }}>
        <span style={{ width: 145, flexShrink: 0, fontSize: 10.5, fontWeight: 600, color: LABEL }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: BLACK, marginRight: 10, flexShrink: 0 }}>:</span>
        <span style={{ fontSize: 10.5, color: VALUE, fontWeight: 500, flex: 1, lineHeight: 1.55 }}>{value}</span>
      </div>
    )
  }

  function Section({ titleKey, title }) {
    return (
      <div style={{ margin: '18px 0 7px' }}>
        <div style={{ height: 2, background: BLACK, marginBottom: 7 }} />
        <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: BLACK }}>
          {titleKey ? t(titleKey) : title}
        </span>
      </div>
    )
  }

  const subtitle = [occupation, city].filter(Boolean).join(' · ')

  return (
    <div className="pdf-area" style={{ background: '#f5f4f0', fontFamily: 'Inter, sans-serif', border: `2px solid ${BLACK}`, minHeight: '100%' }}>
      {/* Yellow header block */}
      <div style={{
        background: YELLOW,
        padding: '24px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: `2px solid ${BLACK}`,
      }}>
        <div>
          <div style={{ fontSize: 44, fontWeight: 900, color: BLACK, letterSpacing: '-0.03em', lineHeight: 1.0 }}>
            {data?.fullName || 'Your Name'}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: BLACK, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 8 }}>
              {subtitle}
            </div>
          )}
        </div>

        {photo && (
          <div style={{
            width: 90, height: 112, flexShrink: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: 'cover',
            backgroundPosition: `${photoPosition.x}% ${photoPosition.y}%`,
            backgroundRepeat: 'no-repeat',
            border: `2px solid ${BLACK}`,
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 36px 28px' }}>
        <Section titleKey="pdf_personal" />
        {personal.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_family" />
        {family.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        <Section titleKey="pdf_contact" />
        {contact.map(([l, v]) => <Row key={l} label={l} value={v} />)}

        {Object.entries(customGrouped).map(([title, rows]) => (
          <div key={title}>
            <Section title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        <div style={{ marginTop: 22, height: 2, background: BLACK }} />
      </div>
    </div>
  )
}
