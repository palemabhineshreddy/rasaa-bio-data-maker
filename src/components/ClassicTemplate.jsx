import { formatDate } from '../utils/formatters'

/* Royal marriage biodata template: formal, family-led, non-resume layout */
export default function ClassicTemplate({ data }) {
  const {
    fullName, gender, dateOfBirth, age, height, weight, bloodGroup,
    religion, caste, subCaste, motherTongue,
    education, college, occupation, company, income, workLocation,
    fatherName, fatherOccupation, motherName, motherOccupation,
    brothers, sisters, familyType, familyStatus, nativePlace,
    hobbies, about,
    rashi, nakshatra, gotra, manglik,
    address, city, state, phone, email,
    photo,
    customFields = []
  } = data

  const name = fullName || 'Your Name'
  const cleanCustomFields = customFields.filter(field => field.label?.trim() && field.value?.trim())
  const customItems = (section) => cleanCustomFields.filter(field => field.section === section)
  const groupedCustomSections = customItems('custom').reduce((groups, field) => {
    const title = field.customTitle?.trim() || 'Additional Details'
    return { ...groups, [title]: [...(groups[title] || []), field] }
  }, {})

  const Item = ({ label, value }) => value ? (
    <div className="rounded-sm border border-rose-100 bg-white px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">{label}</div>
      <div className="mt-1 text-sm font-semibold leading-relaxed text-slate-800">{value}</div>
    </div>
  ) : null

  const Section = ({ title, children }) => (
    <section className="mb-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-2 w-2 rotate-45 bg-rose-700" />
        <h2 className="font-serif text-xl font-bold text-rose-950">{title}</h2>
        <div className="h-px flex-1 bg-rose-200" />
      </div>
      {children}
    </section>
  )

  const contact = [address, city, state].filter(Boolean).join(', ')
  const contactItems = customItems('contact')

  return (
    <div className="pdf-area bg-white p-6" style={{ minHeight: 900, fontFamily: 'Inter, sans-serif' }}>
      <div className="min-h-[852px] bg-[#fff7f8] p-8 ring-1 ring-rose-200">
        <header className="grid grid-cols-[1fr_132px] items-center gap-8 border-b-4 border-double border-rose-300 pb-6">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-rose-700">Rasaa Marriage Biodata</p>
            <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-rose-950">{name}</h1>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {[occupation, [city, state].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Family Biodata'}
            </p>
          </div>
          <div className="rounded-sm border-4 border-white bg-rose-100 shadow-lg ring-1 ring-rose-200">
            {photo ? (
              <img src={photo} alt="profile" className="h-36 w-full object-cover" />
            ) : (
              <div className="flex h-36 items-center justify-center text-5xl">👤</div>
            )}
          </div>
        </header>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Item label="Age" value={age ? `${age} Years` : null} />
          <Item label="Height" value={height} />
          <Item label="Community" value={[religion, caste, subCaste].filter(Boolean).join(' / ')} />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-7">
          <div>
            <Section title="Personal Details">
              <div className="grid gap-3">
                <Item label="Date of Birth" value={formatDate(dateOfBirth)} />
                <Item label="Gender" value={gender} />
                <Item label="Weight" value={weight} />
                <Item label="Blood Group" value={bloodGroup} />
                <Item label="Mother Tongue" value={motherTongue} />
                <Item label="Native Place" value={nativePlace} />
                {customItems('personal').map(field => <Item key={field.id} label={field.label} value={field.value} />)}
              </div>
            </Section>

            {(rashi || nakshatra || gotra || manglik || customItems('horoscope').length > 0) && (
              <Section title="Horoscope Details">
                <div className="grid grid-cols-2 gap-3">
                  <Item label="Rashi" value={rashi} />
                  <Item label="Nakshatra" value={nakshatra} />
                  <Item label="Gotra" value={gotra} />
                  <Item label="Manglik" value={manglik} />
                  {customItems('horoscope').map(field => <Item key={field.id} label={field.label} value={field.value} />)}
                </div>
              </Section>
            )}
          </div>

          <div>
            <Section title="Education & Profession">
              <div className="grid gap-3">
                <Item label="Qualification" value={education} />
                <Item label="College / University" value={college} />
                <Item label="Profession" value={occupation} />
                <Item label="Company" value={company} />
                <Item label="Annual Income" value={income} />
                <Item label="Work Location" value={workLocation} />
                {customItems('career').map(field => <Item key={field.id} label={field.label} value={field.value} />)}
              </div>
            </Section>
          </div>
        </div>

        <Section title="Family Background">
          <div className="grid grid-cols-2 gap-3">
            <Item label="Father" value={[fatherName, fatherOccupation].filter(Boolean).join(' - ')} />
            <Item label="Mother" value={[motherName, motherOccupation].filter(Boolean).join(' - ')} />
            <Item label="Brothers" value={brothers} />
            <Item label="Sisters" value={sisters} />
            <Item label="Family Type" value={familyType} />
            <Item label="Family Status" value={familyStatus} />
            {customItems('family').map(field => <Item key={field.id} label={field.label} value={field.value} />)}
          </div>
        </Section>

        {Object.entries(groupedCustomSections).map(([title, items]) => (
          <Section key={title} title={title}>
            <div className="grid grid-cols-2 gap-3">
              {items.map(field => <Item key={field.id} label={field.label} value={field.value} />)}
            </div>
          </Section>
        ))}

        {(hobbies || about) && (
          <Section title="Personal Note">
            <div className="rounded-sm border border-rose-100 bg-white p-4 text-sm leading-relaxed text-slate-700">
              {hobbies && <p><span className="font-bold text-rose-900">Hobbies: </span>{hobbies}</p>}
              {about && <p className="mt-2 italic">{about}</p>}
            </div>
          </Section>
        )}

        {(phone || email || contact || contactItems.length > 0) && (
          <footer className="mt-6 rounded-sm bg-rose-950 px-5 py-4 text-center text-sm text-rose-50">
            {[phone, email, contact, ...contactItems.map(field => `${field.label}: ${field.value}`)].filter(Boolean).join(' · ')}
          </footer>
        )}
      </div>
    </div>
  )
}
