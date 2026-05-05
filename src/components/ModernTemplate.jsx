import { formatDate } from '../utils/formatters'

/* Telugu wedding biodata template: ceremony-first, family-first, print friendly */
export default function ModernTemplate({ data }) {
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
  const customRows = (section) => cleanCustomFields.filter(field => field.section === section)
  const groupedCustomSections = customRows('custom').reduce((groups, field) => {
    const title = field.customTitle?.trim() || 'Additional Details'
    return { ...groups, [title]: [...(groups[title] || []), field] }
  }, {})

  const Row = ({ label, value }) => value ? (
    <div className="flex border-b border-amber-100 py-2.5">
      <div className="w-40 shrink-0 text-[11px] font-bold uppercase tracking-wider text-red-800">{label}</div>
      <div className="flex-1 text-sm font-medium leading-relaxed text-stone-800">{value}</div>
    </div>
  ) : null

  const Section = ({ title, children }) => (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500 to-red-700" />
        <h2 className="font-serif text-base font-bold uppercase tracking-[0.2em] text-red-900">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500 to-red-700" />
      </div>
      {children}
    </section>
  )

  const personalRows = [
    ['Date of Birth', formatDate(dateOfBirth)],
    ['Age', age ? `${age} Years` : null],
    ['Gender', gender],
    ['Height', height],
    ['Weight', weight],
    ['Blood Group', bloodGroup],
    ['Mother Tongue', motherTongue],
    ['Religion', religion],
    ['Community', [caste, subCaste].filter(Boolean).join(' / ')],
  ]

  const horoscopeRows = [
    ['Rashi', rashi],
    ['Nakshatra', nakshatra],
    ['Gotra', gotra],
    ['Manglik', manglik],
  ]

  const contact = [address, city, state].filter(Boolean).join(', ')
  const contactRows = customRows('contact')

  return (
    <div className="pdf-area bg-[#fffaf0] p-5" style={{ minHeight: 900, fontFamily: 'Inter, sans-serif' }}>
      <div className="min-h-[860px] border-[3px] border-red-900 bg-[#fffdf7] p-3">
        <div className="min-h-[836px] border border-amber-500 p-7">
          <header className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full border border-amber-500 bg-red-900 text-center text-2xl leading-[3rem] text-amber-100">
              ॐ
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-700">Sri Ganeshaya Namaha</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-red-950">{name}</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-red-800">Marriage Biodata</p>
            <div className="mx-auto mt-4 h-1 w-56 rounded-full bg-gradient-to-r from-red-800 via-amber-500 to-red-800" />
          </header>

          <div className="mt-7 grid grid-cols-[150px_1fr] gap-7">
            <aside>
              <div className="overflow-hidden rounded-sm border-4 border-amber-200 bg-red-50 shadow-sm">
                {photo ? (
                  <img src={photo} alt="profile" className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-red-100 to-amber-100 text-5xl">👤</div>
                )}
              </div>
              <div className="mt-4 rounded-sm border border-amber-300 bg-amber-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-800">Contact</p>
                {phone && <p className="mt-2 text-sm font-semibold text-stone-800">{phone}</p>}
                {email && <p className="mt-1 break-words text-xs text-stone-600">{email}</p>}
                {contact && <p className="mt-2 text-xs leading-relaxed text-stone-700">{contact}</p>}
                {contactRows.map(field => (
                  <div key={field.id} className="mt-3 border-t border-amber-200 pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-red-800">{field.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-700">{field.value}</p>
                  </div>
                ))}
              </div>
            </aside>

            <main>
              <Section title="Personal Details">
                <div className="grid grid-cols-2 gap-x-7">
                  {personalRows.map(([label, value]) => <Row key={label} label={label} value={value} />)}
                  {customRows('personal').map(field => <Row key={field.id} label={field.label} value={field.value} />)}
                </div>
              </Section>

              <Section title="Education & Profession">
                <Row label="Qualification" value={education} />
                <Row label="College" value={college} />
                <Row label="Occupation" value={occupation} />
                <Row label="Organisation" value={company} />
                <Row label="Income" value={income} />
                <Row label="Work Location" value={workLocation} />
                {customRows('career').map(field => <Row key={field.id} label={field.label} value={field.value} />)}
              </Section>

              <Section title="Family Details">
                <div className="grid grid-cols-2 gap-x-7">
                  <Row label="Father" value={[fatherName, fatherOccupation].filter(Boolean).join(' - ')} />
                  <Row label="Mother" value={[motherName, motherOccupation].filter(Boolean).join(' - ')} />
                  <Row label="Brothers" value={brothers} />
                  <Row label="Sisters" value={sisters} />
                  <Row label="Family Type" value={familyType} />
                  <Row label="Family Status" value={familyStatus} />
                  <Row label="Native Place" value={nativePlace} />
                  {customRows('family').map(field => <Row key={field.id} label={field.label} value={field.value} />)}
                </div>
              </Section>

              {(rashi || nakshatra || gotra || manglik || customRows('horoscope').length > 0) && (
                <Section title="Horoscope">
                  <div className="grid grid-cols-2 gap-x-7">
                    {horoscopeRows.map(([label, value]) => <Row key={label} label={label} value={value} />)}
                    {customRows('horoscope').map(field => <Row key={field.id} label={field.label} value={field.value} />)}
                  </div>
                </Section>
              )}
            </main>
          </div>

          {Object.entries(groupedCustomSections).map(([title, rows]) => (
            <Section key={title} title={title}>
              <div className="grid grid-cols-2 gap-x-7">
                {rows.map(field => <Row key={field.id} label={field.label} value={field.value} />)}
              </div>
            </Section>
          ))}

          {(hobbies || about) && (
            <div className="mt-5 rounded-sm border border-amber-300 bg-amber-50/80 p-4">
              {hobbies && (
                <p className="text-sm text-stone-800"><span className="font-bold text-red-900">Hobbies: </span>{hobbies}</p>
              )}
              {about && (
                <p className="mt-2 text-sm italic leading-relaxed text-stone-700">{about}</p>
              )}
            </div>
          )}

          <footer className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-amber-700">
            Created with Rasaa Bio Data Maker
          </footer>
        </div>
      </div>
    </div>
  )
}
