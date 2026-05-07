import { formatDate } from '../utils/formatters'

/*
 * Shubh Vivah — Pan-India Marriage Biodata Template
 * Reusable base: swap BRAND_* constants for different regions/castes.
 * Structure (3 sections + photo-top-right) stays the same everywhere.
 */

const COLOR_OUTER     = '#6B0F1A'   // maroon border
const COLOR_GOLD      = '#C9A035'   // gold accent
const COLOR_LABEL     = '#7B2D2D'   // row label color
const COLOR_VALUE     = '#1C0808'   // row value color
const COLOR_BG        = '#FDFDF9'   // premium near-white (barely-warm ivory)

function CornerLotus() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <ellipse cx="18" cy="18" rx="6" ry="13" fill={COLOR_GOLD} fillOpacity="0.18" transform="rotate(0,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke={COLOR_GOLD} strokeWidth="0.8" transform="rotate(0,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill={COLOR_GOLD} fillOpacity="0.18" transform="rotate(45,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke={COLOR_GOLD} strokeWidth="0.8" transform="rotate(45,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill={COLOR_GOLD} fillOpacity="0.18" transform="rotate(90,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke={COLOR_GOLD} strokeWidth="0.8" transform="rotate(90,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill={COLOR_GOLD} fillOpacity="0.18" transform="rotate(135,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke={COLOR_GOLD} strokeWidth="0.8" transform="rotate(135,18,18)" />
      <circle cx="18" cy="18" r="4.5" fill={COLOR_GOLD} />
      <circle cx="18" cy="18" r="2" fill={COLOR_OUTER} />
      <path d="M29,18 Q40,12 51,17" stroke={COLOR_GOLD} strokeWidth="0.9" />
      <path d="M18,29 Q12,40 17,51" stroke={COLOR_GOLD} strokeWidth="0.9" />
      <ellipse cx="40" cy="12" rx="7" ry="2.5" fill={COLOR_GOLD} fillOpacity="0.38" transform="rotate(-20,40,12)" />
      <ellipse cx="12" cy="40" rx="2.5" ry="7" fill={COLOR_GOLD} fillOpacity="0.38" transform="rotate(20,12,40)" />
      <circle cx="51" cy="17" r="2.2" fill={COLOR_GOLD} fillOpacity="0.75" />
      <circle cx="17" cy="51" r="2.2" fill={COLOR_GOLD} fillOpacity="0.75" />
    </svg>
  )
}


function Divider({ title }) {
  return (
    <div data-pdf-divider="true" style={{ margin: '20px 0 6px' }}>
      <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: COLOR_OUTER }}>
        {title}
      </span>
    </div>
  )
}

/* Row: Label : Value — no separator line, clean whitespace */
function Row({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', padding: '4px 0' }}>
      <span style={{ width: 148, flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: COLOR_LABEL }}>{label}</span>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: COLOR_GOLD, marginRight: 10 }}>:</span>
      <span style={{ fontSize: 10.5, color: COLOR_VALUE, fontWeight: 500, flex: 1, lineHeight: 1.5 }}>{value}</span>
    </div>
  )
}

export default function PanIndiaTemplate({ data }) {
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
    customFields = []
  } = data

  const clean = customFields.filter(f => f.label?.trim() && f.value?.trim())
  const bySection = s => clean.filter(f => f.section === s)
  const grouped = bySection('custom').reduce((acc, f) => {
    const t = f.customTitle?.trim() || 'Additional Details'
    return { ...acc, [t]: [...(acc[t] || []), f] }
  }, {})
  const hasHoroscope = rashi || nakshatra || gotra ||
    (manglik && manglik !== 'No') || bySection('horoscope').length > 0

  return (
    <div className="pdf-area" style={{ background: COLOR_BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>

      {/* Outer border */}
      <div style={{ position: 'absolute', top: 6, right: 6, bottom: 6, left: 6, border: `2.5px solid ${COLOR_OUTER}`, pointerEvents: 'none', zIndex: 2 }} />
      {/* Inner border */}
      <div style={{ position: 'absolute', top: 11, right: 11, bottom: 11, left: 11, border: `1px solid ${COLOR_GOLD}`, pointerEvents: 'none', zIndex: 2 }} />

      {/* Corner lotus ornaments */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><CornerLotus /></div>

      <div style={{ padding: '48px 36px 28px', position: 'relative', zIndex: 1 }}>

        {/* ── Header: slogan centred ── */}
        <header style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'serif', fontSize: 13, color: COLOR_GOLD, letterSpacing: '0.14em' }}>
            ॥ श्री गणेशाय नमः ॥
          </div>
        </header>

        {/* ── Section 1: Personal Details ── */}
        <Divider title="Personal Details" />
        <div style={{ display: 'grid', gridTemplateColumns: photo ? '1fr 172px' : '1fr', gap: 20, alignItems: 'flex-start' }}>

          {/* Left: personal + career rows */}
          <div>
            <Row label="Name"           value={fullName} />
            <Row label="Date of Birth"  value={formatDate(dateOfBirth)} />
            <Row label="Age"            value={age ? `${age} Years` : null} />
            <Row label="Height"         value={height} />
            <Row label="Weight"         value={weight} />
            <Row label="Blood Group"    value={bloodGroup} />
            <Row label="Religion"       value={religion} />
            <Row label="Community"      value={[caste, subCaste].filter(Boolean).join(' / ')} />
            <Row label="Mother Tongue"  value={motherTongue} />
            <Row label="Gender"         value={gender} />
            {bySection('personal').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
            <Row label="Education"      value={education} />
            <Row label="College / University" value={college} />
            <Row label="Occupation"     value={occupation} />
            <Row label="Organisation"   value={company} />
            <Row label="Annual Income"  value={income} />
            <Row label="Work Location"  value={workLocation} />
            {bySection('career').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>

          {/* Right: photo — only rendered when a photo is uploaded */}
          {photo && (
            <div style={{ width: 152, height: 192, overflow: 'hidden' }}>
              <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${photoPosition.x}% ${photoPosition.y}%`, display: 'block' }} />
            </div>
          )}
        </div>

        {/* ── Section 2: Family Details ── */}
        <Divider title="Family Details" />
        <Row label="Father" value={fatherName && fatherOccupation ? `${fatherName} (${fatherOccupation})` : fatherName || fatherOccupation} />
        <Row label="Mother" value={motherName && motherOccupation ? `${motherName} (${motherOccupation})` : motherName || motherOccupation} />
        <Row label="Brothers" value={brothers} />
        <Row label="Sisters" value={sisters} />
        <Row label="Family Type" value={familyType} />
        <Row label="Family Status" value={familyStatus} />
        <Row label="Native Place" value={nativePlace} />
        {bySection('family').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        {/* Horoscope — no sub-header in PDF */}
        {hasHoroscope && (
          <>
            <Row label="Rashi" value={rashi} />
            <Row label="Nakshatra" value={nakshatra} />
            <Row label="Gotra" value={gotra} />
            <Row label="Manglik" value={manglik} />
            {bySection('horoscope').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </>
        )}

        {/* ── Section 3: Contact & About ── */}
        <Divider title="Contact & About" />
        <Row label="Phone" value={phone} />
        <Row label="Email" value={email} />
        <Row label="City / State" value={[city, state].filter(Boolean).join(', ')} />
        <Row label="Address" value={address} />
        {bySection('contact').map(f => <Row key={f.id} label={f.label} value={f.value} />)}
        <Row label="Interests & Hobbies" value={hobbies} />
        <Row label="About Me" value={about} />

        {/* ── Custom sections ── */}
        {Object.entries(grouped).map(([title, rows]) => (
          <div key={title}>
            <Divider title={title} />
            {rows.map(f => <Row key={f.id} label={f.label} value={f.value} />)}
          </div>
        ))}

        {/* ── Footer ── */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 5 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${COLOR_GOLD})` }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill={COLOR_GOLD}>
              <rect x="3.5" y="3.5" width="7" height="7" transform="rotate(45 7 7)" />
            </svg>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${COLOR_GOLD})` }} />
          </div>
          <div style={{ fontSize: 8, color: '#9B7320', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Created with Bandhan · bandhan.app
          </div>
        </div>

      </div>
    </div>
  )
}
