import { formatDate } from '../utils/formatters'

/* Pan-India Auspicious Marriage Biodata — lotus corners, gold accents, parchment palette */

function CornerLotus() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <ellipse cx="18" cy="18" rx="6" ry="13" fill="#C9A035" fillOpacity="0.18" transform="rotate(0,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#C9A035" strokeWidth="0.8" transform="rotate(0,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill="#C9A035" fillOpacity="0.18" transform="rotate(45,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#C9A035" strokeWidth="0.8" transform="rotate(45,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill="#C9A035" fillOpacity="0.18" transform="rotate(90,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#C9A035" strokeWidth="0.8" transform="rotate(90,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" fill="#C9A035" fillOpacity="0.18" transform="rotate(135,18,18)" />
      <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#C9A035" strokeWidth="0.8" transform="rotate(135,18,18)" />
      <circle cx="18" cy="18" r="4.5" fill="#C9A035" />
      <circle cx="18" cy="18" r="2" fill="#6B0F1A" />
      <path d="M29,18 Q40,12 51,17" stroke="#C9A035" strokeWidth="0.9" />
      <path d="M18,29 Q12,40 17,51" stroke="#C9A035" strokeWidth="0.9" />
      <ellipse cx="40" cy="12" rx="7" ry="2.5" fill="#C9A035" fillOpacity="0.38" transform="rotate(-20,40,12)" />
      <ellipse cx="12" cy="40" rx="2.5" ry="7" fill="#C9A035" fillOpacity="0.38" transform="rotate(20,12,40)" />
      <circle cx="51" cy="17" r="2.2" fill="#C9A035" fillOpacity="0.75" />
      <circle cx="17" cy="51" r="2.2" fill="#C9A035" fillOpacity="0.75" />
    </svg>
  )
}

function Divider({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 8px' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A035 80%)' }} />
      <svg width="20" height="20" viewBox="0 0 20 20">
        <rect x="6" y="6" width="8" height="8" transform="rotate(45 10 10)" fill="#C9A035" />
        <circle cx="10" cy="1.5" r="1.5" fill="#C9A035" />
        <circle cx="10" cy="18.5" r="1.5" fill="#C9A035" />
        <circle cx="1.5" cy="10" r="1.5" fill="#C9A035" />
        <circle cx="18.5" cy="10" r="1.5" fill="#C9A035" />
      </svg>
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.22em', color: '#6B0F1A', whiteSpace: 'nowrap'
      }}>{title}</span>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <rect x="6" y="6" width="8" height="8" transform="rotate(45 10 10)" fill="#C9A035" />
        <circle cx="10" cy="1.5" r="1.5" fill="#C9A035" />
        <circle cx="10" cy="18.5" r="1.5" fill="#C9A035" />
        <circle cx="1.5" cy="10" r="1.5" fill="#C9A035" />
        <circle cx="18.5" cy="10" r="1.5" fill="#C9A035" />
      </svg>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A035 80%)' }} />
    </div>
  )
}

/* Card-style info block — no row lines */
function InfoCard({ label, value }) {
  if (!value || !label) return null
  return (
    <div style={{
      padding: '7px 10px',
      background: 'rgba(255,248,238,0.8)',
      borderLeft: '2px solid rgba(201,160,53,0.45)',
    }}>
      <div style={{
        fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: '#7B2D2D', marginBottom: 2
      }}>{label}</div>
      <div style={{ fontSize: 12.5, color: '#1C0808', fontWeight: 500, lineHeight: 1.3 }}>{value}</div>
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

  const name = fullName || 'Your Name'
  const clean = customFields.filter(f => f.label?.trim() && f.value?.trim())
  const bySection = s => clean.filter(f => f.section === s)
  const grouped = bySection('custom').reduce((acc, f) => {
    const t = f.customTitle?.trim() || 'Additional Details'
    return { ...acc, [t]: [...(acc[t] || []), f] }
  }, {})

  const hasHoroscope = rashi || nakshatra || gotra ||
    (manglik && manglik !== 'No') || bySection('horoscope').length > 0

  const personalCards = [
    ['Date of Birth', formatDate(dateOfBirth)],
    ['Gender', gender],
    ['Weight', weight],
    ['Blood Group', bloodGroup],
    ['Mother Tongue', motherTongue],
    ['Religion', religion],
    ['Community', [caste, subCaste].filter(Boolean).join(' / ')],
    ...bySection('personal').map(f => [f.label, f.value]),
  ]

  const careerCards = [
    ['Qualification', education],
    ['College', college],
    ['Occupation', occupation],
    ['Organisation', company],
    ['Income', income],
    ['Work Location', workLocation],
    ...bySection('career').map(f => [f.label, f.value]),
  ]

  const familyCards = [
    ['Father', [fatherName, fatherOccupation].filter(Boolean).join(' · ')],
    ['Mother', [motherName, motherOccupation].filter(Boolean).join(' · ')],
    ['Brothers', brothers],
    ['Sisters', sisters],
    ['Family Type', familyType],
    ['Family Status', familyStatus],
    ['Native Place', nativePlace],
    ...bySection('family').map(f => [f.label, f.value]),
  ]

  const horoscopeCards = [
    ['Rashi', rashi],
    ['Nakshatra', nakshatra],
    ['Gotra', gotra],
    ['Manglik', manglik],
    ...bySection('horoscope').map(f => [f.label, f.value]),
  ]

  return (
    <div className="pdf-area" style={{
      background: '#FDFAF4',
      fontFamily: 'Inter, sans-serif',
      minHeight: 900,
      position: 'relative',
    }}>
      {/* Outer maroon border */}
      <div style={{ position: 'absolute', inset: 6, border: '2.5px solid #6B0F1A', pointerEvents: 'none', zIndex: 2 }} />
      {/* Inner gold border */}
      <div style={{ position: 'absolute', inset: 11, border: '1px solid #C9A035', pointerEvents: 'none', zIndex: 2 }} />

      {/* Corner lotus ornaments */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)', zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)', zIndex: 3 }}><CornerLotus /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', zIndex: 3 }}><CornerLotus /></div>

      <div style={{ padding: '52px 32px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Header: fully centered ── */}
        <header style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'serif', fontSize: 30, color: '#C9A035', lineHeight: 1, marginBottom: 3 }}>ॐ</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: '#9B7320', letterSpacing: '0.45em', textTransform: 'uppercase', marginBottom: 10 }}>
            Shubh Vivah
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 340, margin: '0 auto 11px' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#C9A035', opacity: 0.7 }} />
            <svg width="34" height="16" viewBox="0 0 34 16" fill="none">
              <ellipse cx="17" cy="8" rx="7.5" ry="6.5" stroke="#C9A035" strokeWidth="0.9" />
              <ellipse cx="17" cy="8" rx="4" ry="5" fill="#C9A035" fillOpacity="0.38" />
              <circle cx="4" cy="8" r="2" fill="#C9A035" />
              <circle cx="30" cy="8" r="2" fill="#C9A035" />
              <line x1="6" y1="8" x2="9" y2="8" stroke="#C9A035" strokeWidth="0.8" />
              <line x1="25" y1="8" x2="28" y2="8" stroke="#C9A035" strokeWidth="0.8" />
            </svg>
            <div style={{ flex: 1, height: '0.5px', background: '#C9A035', opacity: 0.7 }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#3D0505', margin: '0 0 6px', lineHeight: 1.1 }}>
            {name}
          </h1>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: '#7B2D2D', letterSpacing: '0.32em', textTransform: 'uppercase' }}>
            Marriage Biodata
          </div>
        </header>

        {/* ── Photo: centered below header ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 148, height: 176, border: '2px solid #C9A035', background: '#FFF5E0', overflow: 'hidden' }}>
              {photo ? (
                <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${photoPosition.x}% ${photoPosition.y}%`, display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, background: 'linear-gradient(135deg,#FFF0DC,#FFE4B5)' }}>👤</div>
              )}
            </div>
            <div style={{ position: 'absolute', top: -4, left: -4, width: 14, height: 14, borderTop: '3px solid #6B0F1A', borderLeft: '3px solid #6B0F1A' }} />
            <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderTop: '3px solid #6B0F1A', borderRight: '3px solid #6B0F1A' }} />
            <div style={{ position: 'absolute', bottom: -4, left: -4, width: 14, height: 14, borderBottom: '3px solid #6B0F1A', borderLeft: '3px solid #6B0F1A' }} />
            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 14, height: 14, borderBottom: '3px solid #6B0F1A', borderRight: '3px solid #6B0F1A' }} />
          </div>
        </div>

        {/* ── At a Glance ── */}
        <Divider title="At a Glance" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', marginBottom: 4 }}>
          <InfoCard label="Age" value={age ? `${age} Years` : null} />
          <InfoCard label="Height" value={height} />
          <InfoCard label="Religion" value={religion} />
          <InfoCard label="Community" value={[caste, subCaste].filter(Boolean).join(' / ')} />
          <InfoCard label="Education" value={education} />
          <InfoCard label="Occupation" value={occupation} />
          <InfoCard label="Location" value={[city, state].filter(Boolean).join(', ')} />
          <InfoCard label="Native Place" value={nativePlace} />
        </div>

        {/* ── Personal Details ── */}
        <Divider title="Personal Details" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
          {personalCards.map(([l, v], i) => <InfoCard key={i} label={l} value={v} />)}
        </div>

        {/* ── Education & Career ── */}
        <Divider title="Education & Career" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
          {careerCards.map(([l, v], i) => <InfoCard key={i} label={l} value={v} />)}
        </div>

        {/* ── Family Background ── */}
        <Divider title="Family Background" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
          {familyCards.map(([l, v], i) => <InfoCard key={i} label={l} value={v} />)}
        </div>

        {/* ── Horoscope ── */}
        {hasHoroscope && (
          <>
            <Divider title="Horoscope" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
              {horoscopeCards.map(([l, v], i) => <InfoCard key={i} label={l} value={v} />)}
            </div>
          </>
        )}

        {/* ── Custom sections ── */}
        {Object.entries(grouped).map(([title, rows]) => (
          <div key={title}>
            <Divider title={title} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
              {rows.map(f => <InfoCard key={f.id} label={f.label} value={f.value} />)}
            </div>
          </div>
        ))}

        {/* ── Interests & Passions ── */}
        {hobbies && (
          <>
            <Divider title="Interests & Passions" />
            <InfoCard label="Hobbies & Interests" value={hobbies} />
          </>
        )}

        {/* ── In My Own Words ── */}
        {about && (
          <>
            <Divider title="In My Own Words" />
            <InfoCard label="About" value={about} />
          </>
        )}

        {/* ── Contact Information ── */}
        {(phone || email || address || city || state || bySection('contact').length > 0) && (
          <>
            <Divider title="Contact Information" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
              <InfoCard label="Phone" value={phone} />
              <InfoCard label="Email" value={email} />
              <InfoCard label="City" value={[city, state].filter(Boolean).join(', ')} />
              <InfoCard label="Address" value={address} />
              {bySection('contact').map(f => <InfoCard key={f.id} label={f.label} value={f.value} />)}
            </div>
          </>
        )}

        {/* ── Footer ── */}
        <div style={{ padding: '10px 0 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 5 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, #C9A035)' }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#C9A035">
              <rect x="3.5" y="3.5" width="7" height="7" transform="rotate(45 7 7)" />
            </svg>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, #C9A035)' }} />
          </div>
          <div style={{ fontSize: 8, color: '#9B7320', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Created with Rasaa · rasaa.app
          </div>
        </div>

      </div>
    </div>
  )
}
