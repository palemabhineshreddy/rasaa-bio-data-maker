import { useEffect, useLayoutEffect, useMemo, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Download, Heart, RotateCcw, Search, Plus, Trash2, MessageCircle, LayoutTemplate } from 'lucide-react'
import { useForm } from '@formspree/react'
import BioTemplate from '../components/BioTemplate'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { exportPDF } from '../utils/pdfExport'
import { track } from '../utils/analytics'

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
  track.customFieldAdded(section)
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
  const { t } = useLanguage()
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{t('extra_field')} {index + 1}</div>
          <div className="text-xs text-white/40">{t('extra_field_desc')}</div>
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
          <div >
            <label className="form-label">{t('custom_sec_name')}</label>
            <input
              name={`customFields.${index}.customTitle`}
              className="form-input"
              placeholder={t('ph_custom_sec')}
              value={field.customTitle || ''}
              onChange={event => updateCustomField(formData, updateForm, field.id, { customTitle: event.target.value })}
            />
          </div>
        )}
        <div>
          <label className="form-label">{t('field_name')}</label>
          <input
            name={`customFields.${index}.label`}
            className="form-input"
            placeholder={t('ph_field_name')}
            value={field.label}
            onChange={event => updateCustomField(formData, updateForm, field.id, { label: event.target.value })}
          />
        </div>
        <div>
          <label className="form-label">{t('field_value')}</label>
          <input
            name={`customFields.${index}.value`}
            className="form-input"
            placeholder={t('ph_field_value')}
            value={field.value}
            onChange={event => updateCustomField(formData, updateForm, field.id, { value: event.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function InlineCustomFields({ section, titleKey, formData, updateForm }) {
  const { t } = useLanguage()
  const sectionFields = getCustomFields(formData).filter(field => field.section === section)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">{t(titleKey)}</span>
        <button
          type="button"
          onClick={() => addCustomField(formData, updateForm, section)}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
        >
          <Plus className="h-3 w-3" /> {t('add_field')}
        </button>
      </div>
      {sectionFields.length > 0 && (
        <div className="space-y-3">
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
  const { t } = useLanguage()
  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s1_title')} sub={t('b_s1_sub')} />
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <Field label={t('f_fullName')} name="fullName" formData={formData} updateForm={updateForm} placeholder={t('ph_fullName')} />
        </div>
        <Field label={t('f_gender')} name="gender" formData={formData} updateForm={updateForm} options={['', 'Male', 'Female']} />
        <Field label={t('f_dob')} name="dateOfBirth" formData={formData} updateForm={updateForm} type="date" />
        <Field label={t('f_age')} name="age" formData={formData} updateForm={updateForm} placeholder={t('ph_age')} />
        <Field label={t('f_height')} name="height" formData={formData} updateForm={updateForm} placeholder={t('ph_height')} />
        <Field label={t('f_weight')} name="weight" formData={formData} updateForm={updateForm} placeholder={t('ph_weight')} />
        <Field label={t('f_bloodGroup')} name="bloodGroup" formData={formData} updateForm={updateForm} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
        <Field label={t('f_motherTongue')} name="motherTongue" formData={formData} updateForm={updateForm} placeholder={t('ph_motherTongue')} />
        <Field label={t('f_religion')} name="religion" formData={formData} updateForm={updateForm} placeholder={t('ph_religion')} />
        <Field label={t('f_caste')} name="caste" formData={formData} updateForm={updateForm} placeholder={t('ph_caste')} />
        <Field label={t('f_subCaste')} name="subCaste" formData={formData} updateForm={updateForm} placeholder={t('ph_subCaste')} />
      </div>
      <InlineCustomFields section="personal" titleKey="extra_personal_t" formData={formData} updateForm={updateForm} />

      <div className="space-y-4 pt-2">
        <SectionTitle>{t('sec_horoscope')} <span className="text-white/30 text-sm font-normal">({t('sec_optional')})</span></SectionTitle>
        <div className="grid grid-cols-2 gap-5">
          <Field label={t('f_rashi')} name="rashi" formData={formData} updateForm={updateForm} placeholder={t('ph_rashi')} />
          <Field label={t('f_nakshatra')} name="nakshatra" formData={formData} updateForm={updateForm} placeholder={t('ph_nakshatra')} />
          <Field label={t('f_gotra')} name="gotra" formData={formData} updateForm={updateForm} placeholder={t('ph_gotra')} />
          <Field label={t('f_manglik')} name="manglik" formData={formData} updateForm={updateForm} options={['', 'No', 'Yes', 'Partial']} />
        </div>
        <InlineCustomFields section="horoscope" titleKey="extra_horoscope_t" formData={formData} updateForm={updateForm} />
      </div>

      <div className="space-y-4 pt-2">
        <SectionTitle>About & Expectations</SectionTitle>
        <div className="space-y-4">
          <div>
            <label className="form-label">About Yourself</label>
            <textarea name="about" className="form-input resize-none" rows={3}
              placeholder="Share a little about your personality, values, and interests…"
              value={formData.about} onChange={e => updateForm({ about: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Partner Expectations</label>
            <textarea name="partnerExpectations" className="form-input resize-none" rows={3}
              placeholder="What are you looking for in a life partner?"
              value={formData.partnerExpectations || ''} onChange={e => updateForm({ partnerExpectations: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Education & Career ── */
function Step2({ formData, updateForm }) {
  const { t } = useLanguage()
  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s2_title')} sub={t('b_s2_sub')} />
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <Field label={t('f_education')} name="education" formData={formData} updateForm={updateForm} placeholder={t('ph_education')} />
        </div>
        <Field label={t('f_college')} name="college" formData={formData} updateForm={updateForm} placeholder={t('ph_college')} />
        <Field label={t('f_occupation')} name="occupation" formData={formData} updateForm={updateForm} placeholder={t('ph_occupation')} />
        <Field label={t('f_company')} name="company" formData={formData} updateForm={updateForm} placeholder={t('ph_company')} />
        <Field label={t('f_income')} name="income" formData={formData} updateForm={updateForm} placeholder={t('ph_income')} />
        <div className="col-span-2">
          <Field label={t('f_workLocation')} name="workLocation" formData={formData} updateForm={updateForm} placeholder={t('ph_workLocation')} />
        </div>
      </div>
      <InlineCustomFields section="career" titleKey="extra_career_t" formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Step 3: Family ── */
function Step3({ formData, updateForm }) {
  const { t } = useLanguage()
  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s3_title')} sub={t('b_s3_sub')} />
      <div className="grid grid-cols-2 gap-5">
        <Field label={t('f_fatherName')} name="fatherName" formData={formData} updateForm={updateForm} placeholder={t('ph_fatherName')} />
        <Field label={t('f_fatherOcc')} name="fatherOccupation" formData={formData} updateForm={updateForm} placeholder={t('ph_fatherOcc')} />
        <Field label={t('f_motherName')} name="motherName" formData={formData} updateForm={updateForm} placeholder={t('ph_motherName')} />
        <Field label={t('f_motherOcc')} name="motherOccupation" formData={formData} updateForm={updateForm} placeholder={t('ph_motherOcc')} />
        <Field label={t('f_brothers')} name="brothers" formData={formData} updateForm={updateForm} placeholder={t('ph_brothers')} />
        <Field label={t('f_sisters')} name="sisters" formData={formData} updateForm={updateForm} placeholder={t('ph_sisters')} />
        <Field label={t('f_familyType')} name="familyType" formData={formData} updateForm={updateForm} options={['', 'Nuclear', 'Joint', 'Extended']} />
        <Field label={t('f_familyStatus')} name="familyStatus" formData={formData} updateForm={updateForm} options={['', 'Middle Class', 'Upper Middle Class', 'Business Family', 'Affluent']} />
        <div className="col-span-2">
          <Field label={t('f_nativePlace')} name="nativePlace" formData={formData} updateForm={updateForm} placeholder={t('ph_nativePlace')} />
        </div>
      </div>
      <InlineCustomFields section="family" titleKey="extra_family_t" formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Step 4: Contact ── */
function Step4({ formData, updateForm }) {
  const { t } = useLanguage()
  return (
    <div className="space-y-5">
      <StepHeading title="Contact Information" sub="How families can reach you" />
      <div className="grid grid-cols-2 gap-5">
        <Field label={t('f_phone')} name="phone" formData={formData} updateForm={updateForm} placeholder={t('ph_phone')} />
        <Field label={t('f_email')} name="email" formData={formData} updateForm={updateForm} type="email" placeholder={t('ph_email')} />
        <Field label={t('f_city')} name="city" formData={formData} updateForm={updateForm} placeholder={t('ph_city')} />
        <Field label={t('f_state')} name="state" formData={formData} updateForm={updateForm} placeholder={t('ph_state')} />
        <div className="col-span-2">
          <Field label={t('f_address')} name="address" formData={formData} updateForm={updateForm} placeholder={t('ph_address')} />
        </div>
      </div>
      <InlineCustomFields section="contact" titleKey="extra_contact_t" formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Slogan language picker ── */
const SLOGAN_MAP = {
  hindi:      '॥ श्री गणेशाय नमः ॥',
  telugu:     '॥ శ్రీ గణేశాయ నమః ॥',
  tamil:      '॥ ஸ்ரீ கணேசாய நமஃ ॥',
  kannada:    '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥',
  malayalam:  '॥ ശ്രീ ഗണേശായ നമഃ ॥',
  bengali:    '॥ শ্রী গণেশায় নমঃ ॥',
  gujarati:   '॥ શ્રી ગણેশાય નમઃ ॥',
  marathi:    '॥ श्री गणेशाय नमः ॥',
  odia:       '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥',
  punjabi:    '॥ ਸ਼੍ਰੀ ਗਣੇਸ਼ਾਯ ਨਮਃ ॥',
}
const DEFAULT_SLOGAN_TEXT = '॥ श्री गणेशाय नमः ॥'

const SLOGAN_OPTIONS = [
  { value: 'auto', label: 'Auto — matches mother tongue' },
  { value: 'hide', label: 'None — hide slogan' },
  { value: 'hindi',     label: 'Sanskrit / Hindi  ·  ॥ श्री गणेशाय नमः ॥' },
  { value: 'telugu',    label: 'Telugu  ·  ॥ శ్రీ గణేశాయ నమః ॥' },
  { value: 'tamil',     label: 'Tamil  ·  ॥ ஸ்ரீ கணேசாய நமஃ ॥' },
  { value: 'kannada',   label: 'Kannada  ·  ॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥' },
  { value: 'malayalam', label: 'Malayalam  ·  ॥ ശ്രീ ഗണേശായ നമഃ ॥' },
  { value: 'bengali',   label: 'Bengali  ·  ॥ শ্রী গণেশায় নমঃ ॥' },
  { value: 'gujarati',  label: 'Gujarati  ·  ॥ શ્રી ગણેશાય નમઃ ॥' },
  { value: 'marathi',   label: 'Marathi  ·  ॥ श्री गणेशाय नमः ॥' },
  { value: 'odia',      label: 'Odia  ·  ॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥' },
  { value: 'punjabi',   label: 'Punjabi  ·  ॥ ਸ਼੍ਰੀ ਗਣੇਸ਼ਾਯ ਨਮਃ ॥' },
]

const RELIGION_SLOGANS_MAP = {
  muslim:    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  sikh:      'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ',
  christian: '✝ To God Be The Glory ✝',
  jain:      '॥ जय जिनेन्द्र ॥',
  buddhist:  '॥ नमो बुद्धाय ॥',
}

function getReligionKey(religion) {
  const r = (religion || '').toLowerCase().trim()
  if (r.includes('muslim') || r.includes('islam')) return 'muslim'
  if (r.includes('sikh'))                          return 'sikh'
  if (r.includes('christian') || r.includes('catholic') || r.includes('protestant')) return 'christian'
  if (r.includes('jain'))                          return 'jain'
  if (r.includes('buddhist') || r.includes('buddhism')) return 'buddhist'
  if (r.includes('hindu'))                         return 'hindu'
  return null
}

function resolveSlogan(formData) {
  if ((formData.sloganLanguage ?? 'auto') === 'hide') return null
  // Religion checked first — non-Hindu users never get a Ganesh slogan
  const relKey = getReligionKey(formData.religion)
  if (!relKey) return null
  if (relKey !== 'hindu') return RELIGION_SLOGANS_MAP[relKey] || null
  // Hindu: respect language override, fallback to mother tongue
  const lang = formData.sloganLanguage ?? 'auto'
  const key = lang === 'auto'
    ? (formData.motherTongue || '').toLowerCase().trim()
    : lang
  return SLOGAN_MAP[key] || DEFAULT_SLOGAN_TEXT
}

const RELIGION_DISPLAY_NAMES = {
  muslim: 'Islamic', sikh: 'Sikh', christian: 'Christian', jain: 'Jain', buddhist: 'Buddhist',
}

function SloganPicker({ formData, updateForm }) {
  const relKey = getReligionKey(formData.religion)
  if (!relKey) return null

  const isHindu = relKey === 'hindu'
  const isHidden = (formData.sloganLanguage ?? 'auto') === 'hide'
  const slogan = resolveSlogan(formData)

  return (
    <div className="space-y-3">
      <SectionTitle>Invocation Slogan</SectionTitle>
      <div className="flex flex-wrap items-center gap-4">
        {isHindu ? (
          <select
            name="sloganLanguage"
            className="form-select text-sm max-w-xs"
            style={{ paddingLeft: '1rem' }}
            value={formData.sloganLanguage ?? 'auto'}
            onChange={e => { track.sloganChanged(e.target.value); updateForm({ sloganLanguage: e.target.value }) }}
          >
            {SLOGAN_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <select
            name="sloganLanguage"
            className="form-select text-sm"
            style={{ paddingLeft: '1rem', maxWidth: 260 }}
            value={isHidden ? 'hide' : 'auto'}
            onChange={e => updateForm({ sloganLanguage: e.target.value })}
          >
            <option value="auto">Show — {RELIGION_DISPLAY_NAMES[relKey]} invocation</option>
            <option value="hide">None — hide slogan</option>
          </select>
        )}
        {slogan && (
          <span style={{ fontFamily: 'serif', fontSize: 14, color: '#C9A035', letterSpacing: '0.12em' }}>
            {slogan}
          </span>
        )}
        {isHidden && (
          <span className="text-white/30 text-sm">No slogan will appear</span>
        )}
      </div>
      <p className="text-white/25 text-xs">
        {isHindu
          ? 'Auto matches your mother tongue script. Override to a different language anytime.'
          : 'Slogan is based on your religion. Hide it if not needed.'}
      </p>
    </div>
  )
}

/* ── Template styles catalogue ── */
const TEMPLATE_STYLES = [
  { id: 'lotus',      live: true,  name: 'Lotus',     symbol: '✦', gradient: 'linear-gradient(135deg, #6B0F1A, #C9A035)', desc: 'Gold & maroon · Lotus corners'       },
  { id: 'artDeco',    live: true,  name: 'Art Deco',   symbol: '◇', gradient: 'linear-gradient(135deg, #1B2A4A, #BFA060)', desc: 'Navy & gold · Geometric corners'     },
  { id: 'floralVine', live: true,  name: 'Floral',     symbol: '✿', gradient: 'linear-gradient(135deg, #2A4A1C, #C8A020)', desc: 'Forest green · Petal corners'        },
  { id: 'peacock',    live: true,  name: 'Peacock',    symbol: '☯', gradient: 'linear-gradient(135deg, #0D4A5E, #F0B840)', desc: 'Teal & gold · Feather-eye corners'   },
  { id: 'mandala',    live: true,  name: 'Mandala',    symbol: '◉', gradient: 'linear-gradient(135deg, #7A1A10, #E07830)', desc: 'Rust & orange · Mandala corners'     },
  { id: 'celestial',  live: true,  name: 'Celestial',  symbol: '★', gradient: 'linear-gradient(135deg, #1E0850, #A888E0)', desc: 'Indigo & lavender · Star corners'    },
  { id: 'bridal',     live: true,  name: 'Bridal',     symbol: '❋', gradient: 'linear-gradient(135deg, #720A20, #D4BC90)', desc: 'Crimson & pearl · Ornate corners'    },
  { id: 'minimal',    live: true,  name: 'Minimal',    symbol: '○', gradient: 'linear-gradient(135deg, #4A4540, #9B8B7A)', desc: 'Warm slate · Corner hooks · Understated'    },
  { id: 'royal',      live: true,  name: 'Royal',      symbol: '♛', gradient: 'linear-gradient(135deg, #1A0A3A, #D4A820)', desc: 'Deep indigo · Jewelled frame · Grand'        },
  { id: 'modern',     live: true,  name: 'Modern',     symbol: '◈', gradient: 'linear-gradient(135deg, #0D3D30, #00B894)', desc: 'Teal & cyan · Bold corners · Contemporary'   },
  { id: 'amethyst',   live: true,  name: 'Amethyst',   symbol: '◆', gradient: 'linear-gradient(135deg, #4A0A78, #C070E8)', desc: 'Deep violet · Diamond lattice · Luxurious'  },
  { id: 'ember',      live: true,  name: 'Ember',      symbol: '◐', gradient: 'linear-gradient(135deg, #7A2C08, #F07030)', desc: 'Burnt sienna · Arc fan · Vibrant warmth'    },
  { id: 'rose',       live: true,  name: 'Rose',       symbol: '❀', gradient: 'linear-gradient(135deg, #7A1040, #E898A0)', desc: 'Deep rose · Petal corners · Romantic'       },
  { id: 'midnight',   live: true,  name: 'Midnight',   symbol: '⊡', gradient: 'linear-gradient(135deg, #080818, #4880E0)', desc: 'Near-black · Circuit corners · Ultra modern' },
  { id: 'noir',      live: true,  name: 'Noir',       symbol: '◾', gradient: 'linear-gradient(135deg, #0c0c0c, #e8a820)', desc: 'Jet black · Amber accents · Dark luxury'       },
  { id: 'aurora',    live: true,  name: 'Aurora',     symbol: '✦', gradient: 'linear-gradient(135deg, #1a0040, #002840)', desc: 'Deep gradient · Glowing cyan · Cosmic feel'     },
  { id: 'editorial', live: true,  name: 'Editorial',  symbol: '▮', gradient: 'linear-gradient(135deg, #0f172a, #e5193c)', desc: 'Navy & red · Magazine bold · High contrast'     },
  { id: 'bloom',     live: true,  name: 'Bloom',      symbol: '◉', gradient: 'linear-gradient(135deg, #fdf6ef, #c084fc)', desc: 'Warm cream · Rose accent bar · Soft aesthetic'  },
  { id: 'neo',       live: true,  name: 'Neo',        symbol: '◼', gradient: 'linear-gradient(135deg, #ffe033, #f5f4f0)', desc: 'Yellow header · Bold type · Neo-brutalist'      },
]

/* Portrait thumbnail — matches PDF aspect ratio (760 : ~1060 ≈ 0.72) */
function TemplateMiniPreview({ formData, containerW = 144, visibleH = 200 }) {
  const naturalW = 760
  const scale = containerW / naturalW
  return (
    <div style={{ width: containerW, height: visibleH, overflow: 'hidden' }}>
      <div style={{ width: naturalW, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <BioTemplate data={formData} />
      </div>
    </div>
  )
}

function TemplateCard({ style, isSelected, formData, onSelect }) {
  const previewData = { ...DESIGN_SAMPLE, template: style.id }
  return (
    <div
      onClick={() => style.live && onSelect(style.id)}
      style={{ width: 180, flexShrink: 0, cursor: style.live ? 'pointer' : 'default' }}
    >
      <div style={{
        height: 252, borderRadius: 16, overflow: 'hidden', position: 'relative',
        border: isSelected ? '2px solid #a855f7' : '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: isSelected ? '0 0 0 3px rgba(168,85,247,0.2), 0 12px 32px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.35)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}>
        {style.live ? (
          <TemplateMiniPreview formData={previewData} containerW={180} visibleH={252} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: style.gradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.6 }}>
            <span style={{ fontSize: 40 }}>{style.symbol}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
      <div style={{ padding: '8px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'white' : 'rgba(255,255,255,0.65)' }}>{style.name}</span>
        {style.live
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: 20 }}>Live</span>
          : <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.22)', padding: '2px 4px', borderRadius: 20 }}>Soon</span>
        }
      </div>
    </div>
  )
}

/* 2-row grid scroller — scroll-aware ghost arrows, framer-motion fades */
function BuilderTemplateRow({ styles, formData, onSelect }) {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const SCROLL_STEP = 380 // 2 columns at a time

  const scrollTo = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (dir > 0) {
      el.scrollLeft >= max - 8 ? (el.scrollLeft = 0) : el.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })
    } else {
      el.scrollLeft <= 8 ? (el.scrollLeft = max) : el.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 8)
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [styles])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [styles])

  return (
    <div style={{ position: 'relative' }}>

      {/* Left fade + ghost arrow — hidden at scroll start so first card is fully visible */}
      <AnimatePresence>
        {canLeft && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 bottom-3 w-10 z-[3] flex items-center justify-start pl-0.5"
            style={{ background: 'linear-gradient(to right, #0a0a12 30%, transparent)' }}>
            <motion.button
              onClick={() => scrollTo(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'rgba(255,255,255,0.45)', display: 'flex' }}
              whileHover={{ scale: 1.3, color: 'rgba(255,255,255,0.9)' }}
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.15 }}>
              <ChevronLeft size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="[&::-webkit-scrollbar]:hidden">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 180px)',
          gap: 10,
          padding: '4px 6px 12px',
          width: 'max-content',
        }}>
          {styles.map(s => (
            <TemplateCard key={s.id} style={s} isSelected={formData.template === s.id}
              formData={formData} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {/* Right fade + ghost arrow — hidden when all cards are visible */}
      <AnimatePresence>
        {canRight && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-0 bottom-3 w-10 z-[3] flex items-center justify-end pr-0.5"
            style={{ background: 'linear-gradient(to left, #0a0a12 30%, transparent)' }}>
            <motion.button
              onClick={() => scrollTo(1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'rgba(255,255,255,0.45)', display: 'flex' }}
              whileHover={{ scale: 1.3, color: 'rgba(255,255,255,0.9)' }}
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.15 }}>
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Groups for the Step 6 picker */
const TEMPLATE_GROUPS = [
  { label: 'Classic Collection', ids: ['lotus', 'artDeco', 'floralVine', 'peacock', 'mandala', 'celestial', 'bridal'] },
  { label: 'Modern & Minimal',   ids: ['minimal', 'royal', 'modern', 'amethyst', 'ember', 'rose', 'midnight'] },
  { label: 'New Wave',           ids: ['noir', 'aurora', 'editorial', 'bloom', 'neo'] },
]

/* Shown in template cards when the user hasn't entered their name yet.
   Gives every template a beautiful preview instead of blank sections. */
const DESIGN_SAMPLE = {
  fullName: 'Priya Sharma', dateOfBirth: '14 Feb 1998', age: '26', gender: 'Female',
  height: "5'4\"", weight: '55 kg', bloodGroup: 'B+',
  religion: 'Hindu', caste: 'Brahmin', subCaste: 'Iyer', motherTongue: 'Telugu',
  education: 'B.Tech (Computer Science)', college: 'JNTU Hyderabad',
  occupation: 'Software Engineer', company: 'Infosys', income: '8 LPA', workLocation: 'Bengaluru',
  fatherName: 'Ramesh Sharma', fatherOccupation: 'Retired Govt. Officer',
  motherName: 'Sunita Sharma', motherOccupation: 'Homemaker',
  brothers: '1 Elder Brother (Married)', sisters: 'None',
  familyType: 'Nuclear', familyStatus: 'Middle Class', nativePlace: 'Tirupati, Andhra Pradesh',
  about: 'Family-oriented and calm — loves classical dance, reading, and exploring new places.',
  partnerExpectations: 'Looking for a well-educated, caring partner between 27–32.',
  rashi: 'Vrishabha', nakshatra: 'Rohini', gotra: 'Kashyapa', manglik: 'No',
  address: '12, MG Road, Koramangala', city: 'Bengaluru', state: 'Karnataka',
  phone: '+91 90000 00000', email: 'priya.sharma@email.com',
  photo: null, photoPosition: { x: 50, y: 20 }, sloganLanguage: 'telugu', customFields: [],
}

/* ── Photo drag-to-reposition adjuster ── */
function PhotoAdjuster({ photo, position, onPositionChange, onRemove, onReplace }) {
  const { t } = useLanguage()
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
    <div className="flex flex-wrap items-start gap-4 sm:gap-6">
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
            {t('photo_drag')}
          </div>
        </div>
        <p className="text-xs text-white/30 text-center">{t('photo_drag_hint')}</p>
      </div>
      <div className="text-sm text-white/50 space-y-2 pt-1">
        <p>{t('photo_uploaded')}</p>
        <p className="text-white/30 text-xs">{t('photo_drag_sub')}</p>
        <button onClick={onReplace} className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> {t('photo_change')}
        </button>
        <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
          {t('photo_remove')}
        </button>
      </div>
    </div>
  )
}

/* ── Step 5: Photo & Slogan ── */
function Step5({ formData, updateForm }) {
  const { t } = useLanguage()
  const fileRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5 MB. Please choose a smaller image.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateForm({ photo: ev.target.result, photoPosition: { x: 50, y: 20 } })
      track.photoUploaded()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-10">
      <StepHeading title={t('b_s5_title')} sub={t('b_s5_sub')} />

      {/* Photo upload */}
      <div className="space-y-4">
        <SectionTitle>{t('sec_photo')} <span className="text-white/30 text-sm font-normal">({t('sec_optional')})</span></SectionTitle>
        {formData.photo ? (
          <PhotoAdjuster
            photo={formData.photo}
            position={formData.photoPosition ?? { x: 50, y: 20 }}
            onPositionChange={(pos) => updateForm({ photoPosition: pos })}
            onRemove={() => { track.photoRemoved(); updateForm({ photo: null, photoPosition: { x: 50, y: 20 } }) }}
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
                <span className="text-xs text-center">{t('photo_upload_btn')}</span>
              </div>
            </div>
            <div className="text-sm text-white/50 space-y-1">
              <p>{t('photo_hint')}</p>
              <p className="text-white/30">{t('photo_fmt')}</p>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      <SloganPicker formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Step 6: Design picker with large live preview ── */
function DesignLivePreview({ formData }) {
  const innerRef = useRef()
  const [containerH, setContainerH] = useState(0)
  const naturalW = 760
  const outerRef = useRef(null)
  const [previewW, setPreviewW] = useState(420)

  useLayoutEffect(() => {
    if (!outerRef.current) return
    const w = outerRef.current.offsetWidth
    if (w > 0) setPreviewW(Math.min(420, w))
  })

  const scale = previewW / naturalW

  useLayoutEffect(() => {
    if (!innerRef.current) return
    const h = innerRef.current.scrollHeight
    if (h > 0) setContainerH(h)
  })

  const selectedStyle = TEMPLATE_STYLES.find(s => s.id === (formData.template || 'lotus'))
  const displayH = containerH ? Math.round(containerH * scale) : Math.round(previewW * 1.39)

  return (
    <div ref={outerRef} style={{ width: '100%', maxWidth: 420 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Your Biodata</p>
        {selectedStyle && (
          <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
            {selectedStyle.name}
          </span>
        )}
      </div>
      <div
        style={{
          width: previewW,
          height: displayH,
          overflow: 'hidden',
          borderRadius: 12,
          border: '1.5px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: naturalW,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <BioTemplate data={formData} />
        </div>
      </div>
      <p className="text-[10px] text-white/25 text-center mt-2">Updates instantly as you select</p>
    </div>
  )
}

/* ── Side panel preview — fixed A4 card, template border corners always fill the card ── */
function SidePanelPreview({ formData }) {
  const naturalW = 760
  const panelW = 420
  const scale = panelW / naturalW
  const cardH = Math.round(panelW * 1.414) // A4 ratio ~595px

  return (
    <div style={{ width: panelW }}>
      <div style={{
        width: panelW,
        height: cardH,
        overflow: 'hidden',
        borderRadius: 10,
        border: '1.5px solid rgba(255,255,255,0.12)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        isolation: 'isolate',
      }}>
        {/* Explicit A4 height — template root uses minHeight:100% to fill it,
            pushing border corners to all 4 edges of this card */}
        <div style={{
          width: naturalW,
          height: Math.round(naturalW * 1.414),
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          position: 'relative',
        }}>
          <BioTemplate data={formData} />
        </div>
      </div>
    </div>
  )
}

/* ── Template picker popup — shown when user clicks "Change design" ── */
function TemplatePickerModal({ formData, updateForm, onClose }) {
  const [activeGroup, setActiveGroup] = useState(() => {
    const cur = formData.template || 'lotus'
    const idx = TEMPLATE_GROUPS.findIndex(g => g.ids.includes(cur))
    return idx >= 0 ? idx : 0
  })

  const groupStyles = TEMPLATE_STYLES.filter(s =>
    TEMPLATE_GROUPS[activeGroup].ids.includes(s.id)
  )

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #120828 0%, #0a0a18 100%)',
          border: '1px solid rgba(168,85,247,0.25)',
          borderRadius: 24, padding: '28px 28px 20px',
          maxWidth: 920, width: '100%',
          boxShadow: '0 24px 72px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>Choose Design</p>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}
          >✕</button>
        </div>

        {/* Group tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {TEMPLATE_GROUPS.map((group, gi) => (
            <button key={group.label} onClick={() => setActiveGroup(gi)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeGroup === gi ? 'rgba(168,85,247,0.15)' : 'transparent',
              color: activeGroup === gi ? '#c084fc' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${activeGroup === gi ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.15s',
            }}>
              {group.label}
              <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.5,
                background: activeGroup === gi ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.05)',
                padding: '1px 5px', borderRadius: 8 }}>
                {TEMPLATE_GROUPS[gi].ids.length}
              </span>
            </button>
          ))}
        </div>

        {/* Template row */}
        <AnimatePresence mode="wait">
          <motion.div key={activeGroup}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
            <BuilderTemplateRow
              styles={groupStyles}
              formData={formData}
              onSelect={id => {
                const s = TEMPLATE_STYLES.find(t => t.id === id)
                track.templateSelected(id, s?.name)
                updateForm({ template: id })
                onClose()
              }}
            />
          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
          Click a design to apply · click outside to close
        </p>
      </motion.div>
    </motion.div>
  )
}

function Step6({ formData, updateForm }) {
  const { t } = useLanguage()
  const [activeGroup, setActiveGroup] = useState(0)
  const selectedStyle = TEMPLATE_STYLES.find(s => s.id === (formData.template || 'lotus'))
  const currentGroup = TEMPLATE_GROUPS[activeGroup]
  const groupStyles = TEMPLATE_STYLES.filter(s => currentGroup.ids.includes(s.id))
  // Use sample data for the live preview when user hasn't entered their name yet
  const previewFormData = {
    ...(formData.fullName ? formData : DESIGN_SAMPLE),
    template: formData.template || 'lotus',
  }

  return (
    <div className="space-y-6">
      <StepHeading title={t('b_s6_title')} sub={t('b_s6_sub')} />

      <div className="space-y-4">

        {/* Group tabs — all always visible, wrap to next line if needed */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {TEMPLATE_GROUPS.map((group, gi) => (
            <button key={group.label} onClick={() => setActiveGroup(gi)} style={{
              padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeGroup === gi ? 'rgba(168,85,247,0.15)' : 'transparent',
              color: activeGroup === gi ? '#c084fc' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${activeGroup === gi ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.15s',
            }}>
              {group.label}
              <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.5,
                background: activeGroup === gi ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.05)',
                padding: '1px 5px', borderRadius: 8 }}>
                {group.ids.length}
              </span>
            </button>
          ))}
        </div>

        {/* Template row slides in when group changes */}
        <AnimatePresence mode="wait">
          <motion.div key={activeGroup}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
            <BuilderTemplateRow
              styles={groupStyles}
              formData={formData}
              onSelect={id => {
                const s = TEMPLATE_STYLES.find(t => t.id === id)
                track.templateSelected(id, s?.name)
                updateForm({ template: id })
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Selected info chip */}
        {selectedStyle && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div style={{ width: 32, height: 32, borderRadius: 7, background: selectedStyle.gradient, flexShrink: 0 }} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{selectedStyle.name}</p>
              <p className="text-xs text-white/40 truncate">{selectedStyle.desc}</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1 whitespace-nowrap">
              {t('design_selected')}
            </span>
          </div>
        )}

        {/* Mobile-only preview — clipped at 288px; on sm+ it's shown in the shared right panel */}
        <div className="sm:hidden mt-2">
          <div className="max-h-72 overflow-hidden rounded-xl">
            <motion.div key={formData.template || 'lotus'}
              initial={{ opacity: 0.7, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <DesignLivePreview formData={previewFormData} />
            </motion.div>
          </div>
          <p className="text-center text-[10px] text-white/25 mt-2">
            ↑ preview clipped · tap Preview in nav for full view
          </p>
        </div>

      </div>
    </div>
  )
}


/* ── Steps config — labels resolved via t() at render time ── */
const STEP_KEYS = ['s_personal','s_career','s_family','s_about','s_photo']

/* ── Feedback ── */
const RATINGS = [
  { score: 1, emoji: '😞', labelKey: 'fb_r1' },
  { score: 2, emoji: '😐', labelKey: 'fb_r2' },
  { score: 3, emoji: '🙂', labelKey: 'fb_r3' },
  { score: 4, emoji: '😊', labelKey: 'fb_r4' },
  { score: 5, emoji: '🤩', labelKey: 'fb_r5' },
]

/* ── Download celebration overlay ── */
/* ── Feedback modal (appears immediately after PDF download) ── */
function FeedbackModal({ template, onClose }) {
  const { t } = useLanguage()
  const [rating, setRating] = useState(null)
  const [state, handleSubmit] = useForm('xwvyrbpw')

  useEffect(() => {
    if (state.succeeded) {
      track.feedbackSubmitted(rating, template, false)
      const timer = setTimeout(onClose, 1800)
      return () => clearTimeout(timer)
    }
  }, [state.succeeded])

  const selectedRating = RATINGS.find(r => r.score === rating)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
        padding: 16,
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #1e1035 0%, #150d2a 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 24, padding: '32px 28px',
          maxWidth: 380, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.1)',
        }}
      >
        {state.succeeded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '8px 0' }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🙏</div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{t('prev_thank_you')}</p>
          </motion.div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: 'spring', damping: 12, stiffness: 260, delay: 0.08 }}
                style={{ fontSize: 52, marginBottom: 10 }}
              >✅</motion.div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{t('prev_ready')}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{t('prev_how_was')}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="hidden" name="rating" value={rating ?? ''} />
              <input type="hidden" name="emoji" value={selectedRating?.emoji ?? ''} />
              <input type="hidden" name="template" value={template} />
              <input type="hidden" name="_subject" value={`Bandhan Feedback — ${rating ?? '?'}/5 ${selectedRating?.emoji ?? ''}`} />
              <input type="hidden" name="_replyto" value="hello@bandhan.app" />

              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                {RATINGS.map(r => (
                  <button key={r.score} type="button" onClick={() => setRating(r.score)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 12px', borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: rating === r.score ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                    outline: rating === r.score ? '1.5px solid rgba(168,85,247,0.55)' : '1.5px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: 28, lineHeight: 1, filter: rating !== null && rating !== r.score ? 'grayscale(1) opacity(0.35)' : 'none', transition: 'filter 0.15s' }}>
                      {r.emoji}
                    </span>
                    <span style={{ fontSize: 9, color: rating === r.score ? '#c084fc' : 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {t(r.labelKey)}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {rating !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <textarea
                      name="comment"
                      className="form-input resize-none mb-3" rows={3} maxLength={500}
                      placeholder={rating >= 4 ? t('prev_fb_loved') : t('prev_fb_improve')}
                    />
                    <button type="submit" disabled={state.submitting} className="btn-primary w-full justify-center py-3 text-sm mb-2">
                      {state.submitting ? t('prev_fb_sending') : t('prev_fb_send')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button" onClick={onClose}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '8px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >Skip →</button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Preview + Download ── */
const WA_FALLBACK_TEXT = encodeURIComponent(
  'I just created my marriage biodata on Bandhan — free, no sign-up, takes 5 minutes! Try it: https://bandhan.app'
)

function PreviewStep({ formData, onBack, onEditStep, steps, exportRef }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const pdfBlobRef = useRef(null)

  const handleDownload = async () => {
    setLoading(true)
    setShowModal(false)
    try {
      const { blob } = await exportPDF(exportRef.current, formData.fullName || 'biodata')
      pdfBlobRef.current = blob
      setDownloaded(true)
      setShowModal(true)
      track.pdfDownloaded(formData.template || 'lotus')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    // Generate PDF if not yet downloaded
    let blob = pdfBlobRef.current
    let fileName = `${(formData.fullName || 'biodata').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-biodata.pdf`

    if (!blob) {
      setSharing(true)
      try {
        const result = await exportPDF(exportRef.current, formData.fullName || 'biodata')
        blob = result.blob
        fileName = result.fileName
        pdfBlobRef.current = blob
        setDownloaded(true)
      } catch {
        setSharing(false)
        return
      }
    }

    // Try native share with the actual PDF file (works on mobile)
    if (blob && navigator.canShare) {
      const file = new File([blob], fileName, { type: 'application/pdf' })
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${formData.fullName || 'My'} Biodata`,
            text: 'Here is my marriage biodata — created on Bandhan (bandhan.app)',
          })
          track.whatsappShared('native')
          setSharing(false)
          return
        } catch { /* user cancelled or share failed — fall through */ }
      }
    }

    // Fallback: open WhatsApp with app link (desktop / unsupported browsers)
    track.whatsappShared('link')
    window.open(`https://wa.me/?text=${WA_FALLBACK_TEXT}`, '_blank', 'noopener,noreferrer')
    setSharing(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">{t('prev_title')}</h2>
          <p className="text-white/50 text-sm mt-1">{t('prev_sub')}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {downloaded && (
            <button
              onClick={handleShare}
              disabled={sharing}
              className="btn-ghost text-sm px-5 py-3 border-green-500/40 text-green-400 hover:bg-green-500/10"
            >
              <MessageCircle className="w-4 h-4" />
              {sharing ? t('prev_preparing') : t('prev_share')}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="btn-primary px-5 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-base"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> {t('prev_generating')}</>
            ) : downloaded ? (
              <><Check className="w-5 h-5" /> {t('prev_again')}</>
            ) : (
              <><Download className="w-5 h-5" /> {t('prev_download')}</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {steps.map((label, index) => (
          <button
            key={index}
            onClick={() => onEditStep(index)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-white/70 hover:border-purple-400/60 hover:text-white transition-colors"
          >
            <span className="block text-[10px] uppercase tracking-widest text-purple-300 mb-1">{t('prev_edit_label')}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Biodata preview — same card view as the live preview panel */}
      <div className="flex justify-center">
        <SidePanelPreview formData={formData} />
      </div>

      <div className="flex gap-4 flex-wrap">
        <button onClick={onBack} className="btn-ghost">
          <ChevronLeft className="w-4 h-4" /> {t('prev_edit_details')}
        </button>
        <button onClick={handleDownload} disabled={loading} className="btn-primary flex-1 justify-center py-3 sm:py-4">
          {loading ? t('prev_generating') : <><Download className="w-5 h-5" /> {downloaded ? t('prev_again') : t('prev_download')}</>}
        </button>
        {downloaded && (
          <button
            onClick={handleShare}
            disabled={sharing}
            className="btn-ghost border-green-500/40 text-green-400 hover:bg-green-500/10 justify-center px-6"
          >
            <MessageCircle className="w-4 h-4" /> {sharing ? t('prev_preparing') : t('prev_whatsapp')}
          </button>
        )}
      </div>

      {/* Feedback modal — pops up immediately after download */}
      <AnimatePresence>
        {showModal && (
          <FeedbackModal
            template={formData.template || 'lotus'}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Small helpers ── */
function StepHeading({ title, sub }) {
  return (
    <div className="mb-2">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">{title}</h2>
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
  { label: 'Personal: Horoscope (Rashi)', name: 'rashi', step: 0 },
  { label: 'Personal: About yourself', name: 'about', step: 0 },
  { label: 'Personal: Partner expectations', name: 'partnerExpectations', step: 0 },
  { label: 'Contact: Phone', name: 'phone', step: 3 },
  { label: 'Photo: Upload photo', name: 'photo', step: 4 },
  { label: 'Photo: Invocation slogan', name: 'sloganLanguage', step: 4 },
]

/* ── Main BuilderPage ── */
export default function BuilderPage({ formData, updateForm, onBack }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [pendingFocus, setPendingFocus] = useState('')
  const [showDesignModal, setShowDesignModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const downloadRef = useRef(null)

  const handleQuickDownload = async () => {
    if (!downloadRef.current) return
    setDownloading(true)
    setShowFeedbackModal(false)
    try {
      await exportPDF(downloadRef.current, formData.fullName || 'biodata')
      track.pdfDownloaded(formData.template || 'lotus')
      setShowFeedbackModal(true)
    } finally {
      setDownloading(false)
    }
  }

  const STEPS = STEP_KEYS.map(k => ({ label: t(k) }))
  const totalSteps = STEPS.length

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (step < STEPS.length) {
      track.stepViewed(step, STEPS[step].label)
    } else {
      track.previewViewed(formData.template)
    }
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
    if (step < totalSteps) {
      track.stepCompleted(step, STEPS[step]?.label ?? 'preview')
      setStep(s => s + 1)
    }
  }

  const prev = () => {
    if (step > 0) setStep(s => s - 1)
    else onBack()
  }

  const isPreview = step === totalSteps

  const previewFormData = useMemo(() => ({
    ...formData,
    template: formData.template || 'lotus',
  }), [formData])

  const jumpToField = (fieldName) => {
    const target = FIELD_JUMPS.find(field => field.name === fieldName)
    if (!target) return
    setPendingFocus(target.name)
    setStep(target.step)
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#080810] px-3 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-white/40 hover:text-white/70 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="font-serif text-white font-semibold">Bandhan</span>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher compact />
            {formData.fullName?.trim() && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {t('b_auto_saved')}
              </span>
            )}
            {!isPreview && (
              <div className="text-white/40 text-sm">
                {t('b_step')} {step + 1} {t('b_of')} {totalSteps}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
        {!isPreview && (
          <div className="sticky top-0 z-20 -mx-3 sm:-mx-6 mb-6 sm:mb-8 border-b border-white/10 bg-[#0a0a12]/95 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {STEPS.map((section, index) => (
                  <button
                    key={section.label}
                    onClick={() => setStep(index)}
                    className={`rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors ${
                      step === index
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
                {/* Templates button — mobile only, desktop uses right panel popup */}
                <button
                  onClick={() => setShowDesignModal(true)}
                  className="sm:hidden flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                >
                  <LayoutTemplate className="w-3 h-3" />
                  Templates
                </button>
              </div>
              <label className="relative block md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <select
                  className="form-select text-sm" style={{ paddingLeft: '2.5rem' }}
                  value=""
                  onChange={event => jumpToField(event.target.value)}
                  aria-label="Jump to a specific biodata field"
                >
                  <option value="">{t('b_jump_ph')}</option>
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
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-8 sm:mb-12">
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
                  <div className={`h-px w-4 sm:w-8 transition-colors duration-300 ${i < step ? 'bg-green-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {isPreview ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PreviewStep formData={formData} onBack={() => setStep(4)} onEditStep={setStep} steps={STEPS.map(s => s.label)} exportRef={downloadRef} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex gap-6 lg:gap-8 items-start">

            {/* LEFT: form fills all remaining space */}
            <div className="flex-1 min-w-0">
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
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-10">
                <button onClick={prev} className="btn-ghost px-6">
                  <ChevronLeft className="w-4 h-4" />
                  {step === 0 ? t('b_home') : t('b_back')}
                </button>
                <button
                  onClick={next}
                  disabled={!canNext()}
                  className={`btn-primary flex-1 justify-center py-3 sm:py-4 ${!canNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {step === totalSteps - 1 ? (
                    <><span>{t('b_preview_btn')}</span> <Check className="w-4 h-4" /></>
                  ) : (
                    <><span>{t('b_continue')}</span> <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: live preview — exactly card width, no extra space */}
            <div className="hidden sm:flex flex-col items-end sticky top-20 self-start" style={{ width: 420, flexShrink: 0 }}>
              <div className="flex items-center gap-2 mb-3" style={{ width: 420 }}>
                <button
                  onClick={() => setShowDesignModal(true)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  Templates
                </button>
                <button
                  onClick={handleQuickDownload}
                  disabled={downloading}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:text-green-300 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'Saving…' : 'Download'}
                </button>
                <p className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-white/30">Live Preview</p>
              </div>
              <motion.div
                key={formData.template || 'lotus'}
                initial={{ opacity: 0.7, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <SidePanelPreview formData={previewFormData} />
              </motion.div>
              <p className="text-[10px] text-white/20 mt-2">
                {TEMPLATE_STYLES.find(s => s.id === (formData.template || 'lotus'))?.name} template
              </p>
            </div>

          </div>
        )}
      </main>

      {/* Feedback modal — shown after quick download from preview panel */}
      <AnimatePresence>
        {showFeedbackModal && (
          <FeedbackModal
            template={formData.template || 'lotus'}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Template picker modal */}
      <AnimatePresence>
        {showDesignModal && (
          <TemplatePickerModal
            formData={formData}
            updateForm={updateForm}
            onClose={() => setShowDesignModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Hidden A4-sized template used for PDF export from every step */}
      <div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={downloadRef} style={{ width: 760, height: Math.round(760 * 1.414), overflow: 'hidden', position: 'relative' }}>
          <BioTemplate data={formData} />
        </div>
      </div>
    </div>
  )
}
