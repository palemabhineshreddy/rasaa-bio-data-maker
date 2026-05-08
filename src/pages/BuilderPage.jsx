import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Download, Heart, RotateCcw, Search, Plus, Trash2, MessageCircle } from 'lucide-react'
import PanIndiaTemplate from '../components/PanIndiaTemplate'
import { exportPDF } from '../utils/pdfExport'

/* ── field helpers ── */
const Field = ({ label, name, formData, updateForm, type = 'text', placeholder, options }) => (
  <div>
    <label className="form-label">{label}</label>
    {options ? (
      <select
        name={name}
        className="form-select"
        value={formData[name]}
        onChange={e => updateForm({ [name]: e.target.value })}
      >
        {options.map(o => <option key={o} value={o}>{o === '' ? '— Select —' : o}</option>)}
      </select>
    ) : (
      <input
        name={name}
        type={type}
        className="form-input"
        placeholder={placeholder || label}
        value={formData[name]}
        onChange={e => updateForm({ [name]: e.target.value })}
      />
    )}
  </div>
)

const createId = () => (
  crypto?.randomUUID?.() || `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`
)

function getCustomFields(formData) {
  return formData.customFields || []
}

function addCustomField(formData, updateForm, section = 'custom', customTitle = 'Additional Details') {
  updateForm({
    customFields: [
      ...getCustomFields(formData),
      {
        id: createId(),
        section,
        customTitle,
        label: '',
        value: '',
      },
    ],
  })
}

function updateCustomField(formData, updateForm, id, fields) {
  updateForm({
    customFields: getCustomFields(formData).map(field => (
      field.id === id ? { ...field, ...fields } : field
    )),
  })
}

function removeCustomField(formData, updateForm, id) {
  updateForm({
    customFields: getCustomFields(formData).filter(field => field.id !== id),
  })
}

function CustomFieldEditor({ field, index, formData, updateForm }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Extra Field {index + 1}</div>
          <div className="text-xs text-white/40">This detail will appear in the selected PDF section.</div>
        </div>
        <button
          type="button"
          onClick={() => removeCustomField(formData, updateForm, field.id)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/20 text-red-300 hover:bg-red-400/10"
          aria-label={`Remove extra field ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {field.section === 'custom' && (
          <div className="md:col-span-2">
            <label className="form-label">Custom Section Name</label>
            <input
              name={`customFields.${index}.customTitle`}
              className="form-input"
              placeholder="e.g. Partner Expectations"
              value={field.customTitle || ''}
              onChange={event => updateCustomField(formData, updateForm, field.id, { customTitle: event.target.value })}
            />
          </div>
        )}
        <div>
          <label className="form-label">Field Name</label>
          <input
            name={`customFields.${index}.label`}
            className="form-input"
            placeholder="e.g. Time of Birth"
            value={field.label}
            onChange={event => updateCustomField(formData, updateForm, field.id, { label: event.target.value })}
          />
        </div>
        <div>
          <label className="form-label">Value</label>
          <input
            name={`customFields.${index}.value`}
            className="form-input"
            placeholder="e.g. 6:45 AM"
            value={field.value}
            onChange={event => updateCustomField(formData, updateForm, field.id, { value: event.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function InlineCustomFields({ section, title = 'Extra Fields', help, formData, updateForm }) {
  const sectionFields = getCustomFields(formData).filter(field => field.section === section)

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-purple-300">{title}</h4>
          {help && <p className="mt-1 text-sm text-white/45">{help}</p>}
        </div>
        <button
          type="button"
          onClick={() => addCustomField(formData, updateForm, section)}
          className="btn-ghost justify-center border-dashed px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" /> Add extra field
        </button>
      </div>

      {sectionFields.length > 0 && (
        <div className="space-y-4">
          {sectionFields.map((field, index) => (
            <CustomFieldEditor
              key={field.id}
              field={field}
              index={index}
              formData={formData}
              updateForm={updateForm}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Step 1: Personal ── */
function Step1({ formData, updateForm }) {
  return (
    <div className="space-y-5">
      <StepHeading title="Personal Details" sub="Tell us about yourself — the basics that matter most." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Full Name *" name="fullName" formData={formData} updateForm={updateForm} placeholder="e.g. Priya Sharma" />
        </div>
        <Field label="Gender" name="gender" formData={formData} updateForm={updateForm} options={['', 'Male', 'Female']} />
        <Field label="Date of Birth" name="dateOfBirth" formData={formData} updateForm={updateForm} type="date" />
        <Field label="Age (Years)" name="age" formData={formData} updateForm={updateForm} placeholder="e.g. 26" />
        <Field label="Height" name="height" formData={formData} updateForm={updateForm} placeholder={`e.g. 5'6"`} />
        <Field label="Weight (kg)" name="weight" formData={formData} updateForm={updateForm} placeholder="e.g. 60 kg" />
        <Field label="Blood Group" name="bloodGroup" formData={formData} updateForm={updateForm} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
        <Field label="Mother Tongue" name="motherTongue" formData={formData} updateForm={updateForm} placeholder="e.g. Telugu, Tamil, Hindi" />
        <Field label="Religion" name="religion" formData={formData} updateForm={updateForm} placeholder="e.g. Hindu, Muslim, Christian" />
        <Field label="Caste / Community" name="caste" formData={formData} updateForm={updateForm} placeholder="e.g. Reddy, Brahmin" />
        <Field label="Sub-Caste (optional)" name="subCaste" formData={formData} updateForm={updateForm} placeholder="e.g. Kamma" />
      </div>
      <InlineCustomFields
        section="personal"
        title="Extra Personal Details"
        help="Add details like time of birth, place of birth, complexion, or other family-required personal details."
        formData={formData}
        updateForm={updateForm}
      />
    </div>
  )
}

/* ── Step 2: Education & Career ── */
function Step2({ formData, updateForm }) {
  return (
    <div className="space-y-5">
      <StepHeading title="Education & Career" sub="Your qualifications and professional life." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Highest Qualification *" name="education" formData={formData} updateForm={updateForm} placeholder="e.g. B.Tech, MBA, MBBS" />
        </div>
        <Field label="College / University" name="college" formData={formData} updateForm={updateForm} placeholder="e.g. IIT Delhi, BITS Pilani" />
        <Field label="Occupation *" name="occupation" formData={formData} updateForm={updateForm} placeholder="e.g. Software Engineer, Doctor" />
        <Field label="Company / Organisation" name="company" formData={formData} updateForm={updateForm} placeholder="e.g. Infosys, Apollo Hospital" />
        <Field label="Annual Income (optional)" name="income" formData={formData} updateForm={updateForm} placeholder="e.g. 12 LPA, 8–10 LPA" />
        <div className="md:col-span-2">
          <Field label="Work Location / City" name="workLocation" formData={formData} updateForm={updateForm} placeholder="e.g. Bengaluru, Hyderabad" />
        </div>
      </div>
      <InlineCustomFields
        section="career"
        title="Extra Career Details"
        help="Add details like visa status, business type, job location preference, or achievements."
        formData={formData}
        updateForm={updateForm}
      />
    </div>
  )
}

/* ── Step 3: Family ── */
function Step3({ formData, updateForm }) {
  return (
    <div className="space-y-5">
      <StepHeading title="Family Details" sub="Your family background — parents, siblings, and roots." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Father's Name" name="fatherName" formData={formData} updateForm={updateForm} placeholder="e.g. Ramesh Sharma" />
        <Field label="Father's Occupation" name="fatherOccupation" formData={formData} updateForm={updateForm} placeholder="e.g. Businessman, Retired IAS" />
        <Field label="Mother's Name" name="motherName" formData={formData} updateForm={updateForm} placeholder="e.g. Sunita Sharma" />
        <Field label="Mother's Occupation" name="motherOccupation" formData={formData} updateForm={updateForm} placeholder="e.g. Homemaker, Teacher" />
        <Field label="Brothers" name="brothers" formData={formData} updateForm={updateForm} placeholder="e.g. 1 Elder (Married)" />
        <Field label="Sisters" name="sisters" formData={formData} updateForm={updateForm} placeholder="e.g. 1 Younger (Unmarried)" />
        <Field label="Family Type" name="familyType" formData={formData} updateForm={updateForm} options={['', 'Nuclear', 'Joint', 'Extended']} />
        <Field label="Family Status" name="familyStatus" formData={formData} updateForm={updateForm} options={['', 'Middle Class', 'Upper Middle Class', 'Business Family', 'Affluent']} />
        <div className="md:col-span-2">
          <Field label="Native Place" name="nativePlace" formData={formData} updateForm={updateForm} placeholder="e.g. Tirupati, Andhra Pradesh" />
        </div>
      </div>
      <InlineCustomFields
        section="family"
        title="Extra Family Details"
        help="Add details like maternal family, family property, ancestral origin, or family values."
        formData={formData}
        updateForm={updateForm}
      />
    </div>
  )
}

/* ── Step 4: About + Horoscope + Contact ── */
function Step4({ formData, updateForm }) {
  return (
    <div className="space-y-8">
      <StepHeading title="About & Contact" sub="Add a personal touch and your horoscope details." />

      <div className="space-y-5">
        <SectionTitle>About Yourself</SectionTitle>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="form-label">Hobbies & Interests</label>
            <input
              name="hobbies"
              className="form-input"
              placeholder="e.g. Reading, Badminton, Classical dance, Cooking"
              value={formData.hobbies}
              onChange={e => updateForm({ hobbies: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">About Yourself (optional)</label>
            <textarea
              name="about"
              className="form-input resize-none"
              rows={3}
              placeholder="A short description about your personality, values, or what you're looking for..."
              value={formData.about}
              onChange={e => updateForm({ about: e.target.value })}
            />
          </div>
        </div>
        <InlineCustomFields
          section="custom"
          title="Personal Note Sections"
          help="Add a separate section such as Partner Expectations, Lifestyle, or Preferences."
          formData={formData}
          updateForm={updateForm}
        />
      </div>

      <div className="space-y-5">
        <SectionTitle>Horoscope Details <span className="text-white/30 text-sm font-normal">(optional)</span></SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Rashi (Moon Sign)" name="rashi" formData={formData} updateForm={updateForm} placeholder="e.g. Vrishabha, Mesha" />
          <Field label="Nakshatra / Star" name="nakshatra" formData={formData} updateForm={updateForm} placeholder="e.g. Rohini, Ashwini" />
          <Field label="Gotra" name="gotra" formData={formData} updateForm={updateForm} placeholder="e.g. Kashyapa, Bharadvaja" />
          <Field label="Manglik" name="manglik" formData={formData} updateForm={updateForm} options={['', 'No', 'Yes', 'Partial']} />
        </div>
        <InlineCustomFields
          section="horoscope"
          title="Extra Horoscope Details"
          help="Add time of birth, place of birth, lagna, padam, or other astrology details."
          formData={formData}
          updateForm={updateForm}
        />
      </div>

      <div className="space-y-5">
        <SectionTitle>Contact Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Phone Number" name="phone" formData={formData} updateForm={updateForm} placeholder="+91 98765 43210" />
          <Field label="Email (optional)" name="email" formData={formData} updateForm={updateForm} type="email" placeholder="name@email.com" />
          <Field label="City" name="city" formData={formData} updateForm={updateForm} placeholder="e.g. Hyderabad" />
          <Field label="State" name="state" formData={formData} updateForm={updateForm} placeholder="e.g. Telangana" />
          <div className="md:col-span-2">
            <Field label="Address (optional)" name="address" formData={formData} updateForm={updateForm} placeholder="House / flat, street, area" />
          </div>
        </div>
        <InlineCustomFields
          section="contact"
          title="Extra Contact Details"
          help="Add alternate phone, parent contact, WhatsApp number, or preferred contact time."
          formData={formData}
          updateForm={updateForm}
        />
      </div>
    </div>
  )
}

/* ── Template styles catalogue ── */
const TEMPLATE_STYLES = [
  {
    id: 'panIndia', live: true, name: 'Classic', symbol: '✦',
    gradient: 'linear-gradient(135deg, #b45309, #C9A035, #92400e)',
    desc: 'Gold & maroon · Lotus borders · Timeless',
  },
  {
    id: 'minimal', live: false, name: 'Minimal', symbol: '○',
    gradient: 'linear-gradient(135deg, #374151, #6b7280)',
    desc: 'Clean typography · No borders',
  },
  {
    id: 'royal', live: false, name: 'Royal', symbol: '♛',
    gradient: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
    desc: 'Deep navy · Gold filigree',
  },
  {
    id: 'modern', live: false, name: 'Modern', symbol: '◈',
    gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    desc: 'Contemporary · Fresh feel',
  },
]

/* Scaled-down preview of the actual template using user's own data */
function TemplateMiniPreview({ formData, containerW = 168, visibleH = 132 }) {
  const naturalW = 760
  const scale = containerW / naturalW
  return (
    <div style={{ width: containerW, height: visibleH, overflow: 'hidden' }}>
      <div style={{ width: naturalW, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <PanIndiaTemplate data={formData} />
      </div>
    </div>
  )
}

function TemplateCard({ style, isSelected, formData, onSelect }) {
  return (
    <div
      onClick={() => style.live && onSelect(style.id)}
      style={{ width: 168, flexShrink: 0, cursor: style.live ? 'pointer' : 'default' }}
    >
      <div style={{
        height: 132, borderRadius: 14, overflow: 'hidden', position: 'relative',
        border: isSelected ? '2px solid #a855f7' : '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: isSelected ? '0 0 0 3px rgba(168,85,247,0.2)' : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}>
        {style.live ? (
          <TemplateMiniPreview formData={formData} containerW={168} visibleH={132} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: style.gradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 0.7 }}>
            <span style={{ fontSize: 32 }}>{style.symbol}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
        {isSelected && (
          <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div style={{ padding: '8px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? 'white' : 'rgba(255,255,255,0.65)' }}>{style.name}</span>
        {style.live
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: 20 }}>Live</span>
          : <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 20 }}>Soon</span>
        }
      </div>
    </div>
  )
}

/* ── Photo drag-to-reposition adjuster ── */
function PhotoAdjuster({ photo, position, onPositionChange, onRemove, onReplace }) {
  const containerRef = useRef()
  const dragging = useRef(false)

  const getPos = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))),
      y: Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))),
    }
  }

  const onMouseDown = (e) => { dragging.current = true; e.preventDefault() }
  const onMouseMove = (e) => { if (dragging.current) onPositionChange(getPos(e.clientX, e.clientY)) }
  const onMouseUp = () => { dragging.current = false }
  const onTouchStart = () => { dragging.current = true }
  const onTouchMove = (e) => {
    if (!dragging.current) return
    const t = e.touches[0]
    onPositionChange(getPos(t.clientX, t.clientY))
  }
  const onTouchEnd = () => { dragging.current = false }

  return (
    <div className="flex items-start gap-6">
      <div className="space-y-2">
        <div
          ref={containerRef}
          className="relative overflow-hidden select-none"
          style={{ width: 130, height: 158, cursor: 'grab', border: '2px solid rgba(168,85,247,0.5)', borderRadius: 12 }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          <img
            src={photo} alt="preview" draggable={false}
            className="w-full h-full pointer-events-none"
            style={{ objectFit: 'cover', objectPosition: `${position.x}% ${position.y}%` }}
          />
          <div className="absolute bottom-0 inset-x-0 text-center text-[10px] text-white py-1"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            Drag to reposition
          </div>
        </div>
        <p className="text-xs text-white/30 text-center">Drag the photo to frame it</p>
      </div>
      <div className="text-sm text-white/50 space-y-2 pt-1">
        <p>Photo uploaded ✓</p>
        <p className="text-white/30 text-xs">Drag the preview to move the crop position</p>
        <button onClick={onReplace} className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Change photo
        </button>
        <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
          Remove photo
        </button>
      </div>
    </div>
  )
}

/* ── Step 5: Style + Photo ── */
function Step5({ formData, updateForm }) {
  const fileRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateForm({ photo: ev.target.result, photoPosition: { x: 50, y: 20 } })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-10">
      <StepHeading title="Style & Photo" sub="Pick a template style and add your photo. You can switch style anytime." />

      {/* Template style picker */}
      <div className="space-y-4">
        <SectionTitle>Choose Style</SectionTitle>
        <div
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="[&::-webkit-scrollbar]:hidden -mx-2"
        >
          <div style={{ display: 'flex', gap: 14, padding: '4px 8px 12px' }}>
            {TEMPLATE_STYLES.map(s => (
              <TemplateCard
                key={s.id}
                style={s}
                isSelected={formData.template === s.id}
                formData={formData}
                onSelect={id => updateForm({ template: id })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Photo upload */}
      <div className="space-y-4">
        <SectionTitle>Your Photo <span className="text-white/30 text-sm font-normal">(optional)</span></SectionTitle>
        <div>
          {formData.photo ? (
            <PhotoAdjuster
              photo={formData.photo}
              position={formData.photoPosition ?? { x: 50, y: 20 }}
              onPositionChange={(pos) => updateForm({ photoPosition: pos })}
              onRemove={() => updateForm({ photo: null, photoPosition: { x: 50, y: 20 } })}
              onReplace={() => fileRef.current?.click()}
            />
          ) : (
            <div className="flex items-center gap-6">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-purple-500/60 transition-colors overflow-hidden bg-white/5 group"
              >
                <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-purple-400 transition-colors">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs text-center">Click to upload</span>
                </div>
              </div>
              <div className="text-sm text-white/50 space-y-1">
                <p>Upload a clear, front-facing photo</p>
                <p className="text-white/30">JPG, PNG · Max 5MB</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>
      </div>
    </div>
  )
}

/* ── Sample data for template preview ── */
const SAMPLE_DATA = {
  fullName: 'Priya Sharma', dateOfBirth: '1998-03-12', age: '26', gender: 'Female',
  height: "5'4\"", weight: '55 kg', bloodGroup: 'B+',
  religion: 'Hindu', caste: 'Brahmin', subCaste: 'Iyer', motherTongue: 'Telugu',
  education: 'B.Tech (Computer Science)', college: 'JNTU Hyderabad',
  occupation: 'Software Engineer', company: 'Infosys', income: '8 LPA', workLocation: 'Bengaluru',
  fatherName: 'Ramesh Sharma', fatherOccupation: 'Retired Government Officer',
  motherName: 'Sunita Sharma', motherOccupation: 'Homemaker',
  brothers: '1 Elder Brother (Married)', sisters: 'None',
  familyType: 'Nuclear', familyStatus: 'Middle Class', nativePlace: 'Tirupati, Andhra Pradesh',
  hobbies: 'Classical Dance, Reading, Cooking, Badminton',
  about: 'Family-oriented, Calm & composed, Love to travel, Value traditions',
  rashi: 'Vrishabha', nakshatra: 'Rohini', gotra: 'Kashyapa', manglik: 'No',
  address: '12, MG Road, Koramangala', city: 'Bengaluru', state: 'Karnataka',
  phone: '+91 90000 00000', email: 'priya.sharma@email.com',
  photo: null, photoPosition: { x: 50, y: 20 }, template: 'panIndia', customFields: [],
}

/* ── Steps config ── */
const STEPS = [
  { label: 'Personal' },
  { label: 'Career' },
  { label: 'Family' },
  { label: 'About' },
  { label: 'Style' },
]

/* ── Preview + Download ── */
const WA_TEXT = encodeURIComponent(
  'I just created my marriage biodata on Bandhan — free, no sign-up, takes 5 minutes! Try it: https://bandhan.app'
)

function PreviewStep({ formData, onBack, onEditStep }) {
  const previewRef = useRef()
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      await exportPDF(previewRef.current, formData.fullName || 'biodata')
      setDownloaded(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Preview Your Biodata</h2>
          <p className="text-white/50 text-sm mt-1">Looks good? Download your PDF.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {downloaded && (
            <a
              href={`https://wa.me/?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm px-5 py-3 border-green-500/40 text-green-400 hover:bg-green-500/10"
            >
              <MessageCircle className="w-4 h-4" /> Share on WhatsApp
            </a>
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="btn-primary px-8 py-4 text-base"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> Generating...</>
            ) : downloaded ? (
              <><Check className="w-5 h-5" /> Download Again</>
            ) : (
              <><Download className="w-5 h-5" /> Download PDF</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STEPS.map((section, index) => (
          <button
            key={section.label}
            onClick={() => onEditStep(index)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-white/70 hover:border-purple-400/60 hover:text-white transition-colors"
          >
            <span className="block text-[10px] uppercase tracking-widest text-purple-300 mb-1">Edit</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Biodata preview */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" ref={previewRef}>
        <PanIndiaTemplate data={formData} />
      </div>

      <div className="flex gap-4 flex-wrap">
        <button onClick={onBack} className="btn-ghost">
          <ChevronLeft className="w-4 h-4" /> Edit Details
        </button>
        <button onClick={handleDownload} disabled={loading} className="btn-primary flex-1 justify-center py-4">
          {loading ? 'Generating PDF...' : <><Download className="w-5 h-5" /> {downloaded ? 'Download Again' : 'Download PDF'}</>}
        </button>
        {downloaded && (
          <a
            href={`https://wa.me/?text=${WA_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost border-green-500/40 text-green-400 hover:bg-green-500/10 justify-center px-6"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

/* ── Small helpers ── */
function StepHeading({ title, sub }) {
  return (
    <div className="mb-2">
      <h2 className="font-serif text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-white/50 text-sm">{sub}</p>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">{children}</h3>
}

const FIELD_JUMPS = [
  { label: 'Personal: Full name', name: 'fullName', step: 0 },
  { label: 'Personal: Date of birth', name: 'dateOfBirth', step: 0 },
  { label: 'Personal: Age', name: 'age', step: 0 },
  { label: 'Personal: Height', name: 'height', step: 0 },
  { label: 'Personal: Weight', name: 'weight', step: 0 },
  { label: 'Personal: Religion', name: 'religion', step: 0 },
  { label: 'Personal: Caste / community', name: 'caste', step: 0 },
  { label: 'Career: Qualification', name: 'education', step: 1 },
  { label: 'Career: Occupation', name: 'occupation', step: 1 },
  { label: 'Career: Income', name: 'income', step: 1 },
  { label: 'Family: Father details', name: 'fatherName', step: 2 },
  { label: 'Family: Mother details', name: 'motherName', step: 2 },
  { label: 'Family: Siblings', name: 'brothers', step: 2 },
  { label: 'About: Hobbies', name: 'hobbies', step: 3 },
  { label: 'About: Horoscope', name: 'rashi', step: 3 },
  { label: 'Contact: Phone', name: 'phone', step: 3 },
  { label: 'Design: Photo and template', name: 'template', step: 4 },
]

/* ── Main BuilderPage ── */
export default function BuilderPage({ formData, updateForm, onBack }) {
  const [step, setStep] = useState(0) // 0–4 = form steps, 5 = preview
  const [pendingFocus, setPendingFocus] = useState('')
  const totalSteps = STEPS.length

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  useEffect(() => {
    if (!pendingFocus) return
    const timer = window.setTimeout(() => {
      const field = document.querySelector(`[name="${pendingFocus}"]`)
      field?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      field?.focus?.()
      setPendingFocus('')
    }, 250)

    return () => window.clearTimeout(timer)
  }, [pendingFocus, step])

  const canNext = () => {
    if (step === 0) return formData.fullName.trim().length > 0
    if (step === 1) return formData.occupation.trim().length > 0
    return true
  }

  const next = () => {
    if (step < totalSteps) setStep(s => s + 1)
  }

  const prev = () => {
    if (step > 0) setStep(s => s - 1)
    else onBack()
  }

  const isPreview = step === totalSteps

  const loadSample = () => {
    updateForm(SAMPLE_DATA)
    setStep(totalSteps)
  }

  const jumpToField = (fieldName) => {
    const target = FIELD_JUMPS.find(field => field.name === fieldName)
    if (!target) return
    setPendingFocus(target.name)
    setStep(target.step)
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#080810] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-white/40 hover:text-white/70 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="font-serif text-white font-semibold">Bandhan</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={loadSample}
              className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/50 rounded-lg px-3 py-1.5 transition-colors"
            >
              Try sample
            </button>
            {formData.fullName?.trim() && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Auto-saved
              </span>
            )}
            {!isPreview && (
              <div className="text-white/40 text-sm">
                Step {step + 1} of {totalSteps}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!isPreview && (
          <div className="sticky top-0 z-20 -mx-6 mb-8 border-b border-white/10 bg-[#0a0a12]/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {STEPS.map((section, index) => (
                  <button
                    key={section.label}
                    onClick={() => setStep(index)}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      step === index
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <label className="relative block md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <select
                  className="form-select pl-10 text-sm"
                  value=""
                  onChange={event => jumpToField(event.target.value)}
                  aria-label="Jump to a specific biodata field"
                >
                  <option value="">Jump to field...</option>
                  {FIELD_JUMPS.map(field => (
                    <option key={field.name} value={field.name}>{field.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Progress dots */}
        {!isPreview && (
          <div className="flex items-center justify-center gap-3 mb-12">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <button
                  onClick={() => setStep(i)}
                  className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}
                  aria-label={`Go to ${s.label} section`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 transition-colors duration-300 ${i < step ? 'bg-green-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <Step1 formData={formData} updateForm={updateForm} />}
            {step === 1 && <Step2 formData={formData} updateForm={updateForm} />}
            {step === 2 && <Step3 formData={formData} updateForm={updateForm} />}
            {step === 3 && <Step4 formData={formData} updateForm={updateForm} />}
            {step === 4 && <Step5 formData={formData} updateForm={updateForm} />}
            {isPreview && <PreviewStep formData={formData} onBack={() => setStep(4)} onEditStep={setStep} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        {!isPreview && (
          <div className="flex gap-4 mt-10">
            <button onClick={prev} className="btn-ghost px-6">
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? 'Home' : 'Back'}
            </button>
            <button
              onClick={step === totalSteps - 1 ? next : next}
              disabled={!canNext()}
              className={`btn-primary flex-1 justify-center py-4 ${!canNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {step === totalSteps - 1 ? (
                <><span>Preview Biodata</span> <Check className="w-4 h-4" /></>
              ) : (
                <><span>Continue</span> <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
