import { useEffect, useLayoutEffect, useMemo, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Download, RotateCcw, Search, Plus, Trash2, MessageCircle, LayoutTemplate, X } from 'lucide-react'
import { useForm } from '@formspree/react'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import BioTemplate from '../components/BioTemplate'
import LivePreview from '../components/LivePreview'
import SortableFieldRow from '../components/SortableFieldRow'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme, useBuilderTheme } from '../contexts/ThemeContext'
import { exportPDF } from '../utils/pdfExport'
import { track } from '../utils/analytics'
import { DEFAULT_FIELD_ORDER, getFieldOrder } from '../utils/fieldGroups'

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
  const T = useBuilderTheme()
  return (
    <div style={{ borderRadius: 16, border: `1px solid ${T.borderStrong}`, background: T.customFieldBg, padding: 20 }}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t('extra_field')} {index + 1}</div>
          <div style={{ fontSize: 12, color: T.textFaint }}>{t('extra_field_desc')}</div>
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

function InlineCustomFields({ section, titleKey, formData, updateForm, showHeader = true }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
  const sectionFields = getCustomFields(formData).filter(field => field.section === section)

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.sectionTitleColor }}>{t(titleKey)}</span>
          <button
            type="button"
            onClick={() => addCustomField(formData, updateForm, section)}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: T.accentGold, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus className="h-3 w-3" /> {t('add_field')}
          </button>
        </div>
      )}
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

/* ── Optional section toggle ── */
const DEFAULT_SECTIONS_ENABLED = { about: false, partnerExpectations: false, horoscope: false }

function applyEnabledSections(formData) {
  const se = { ...DEFAULT_SECTIONS_ENABLED, ...(formData.sectionsEnabled || {}) }
  let customFields = formData.customFields || []
  if (!se.horoscope) customFields = customFields.filter(f => f.section !== 'horoscope')
  return {
    ...formData,
    about: se.about ? formData.about : '',
    partnerExpectations: se.partnerExpectations ? formData.partnerExpectations : '',
    rashi:     se.horoscope ? formData.rashi     : '',
    nakshatra: se.horoscope ? formData.nakshatra : '',
    gotra:     se.horoscope ? formData.gotra     : '',
    manglik:   se.horoscope ? formData.manglik   : '',
    customFields,
  }
}

function SectionToggle({ sectionKey, label, formData, updateForm, children, headerExtra }) {
  const T = useBuilderTheme()
  const se = { ...DEFAULT_SECTIONS_ENABLED, ...(formData.sectionsEnabled || {}) }
  const enabled = se[sectionKey]

  const toggle = () => updateForm({
    sectionsEnabled: { ...DEFAULT_SECTIONS_ENABLED, ...(formData.sectionsEnabled || {}), [sectionKey]: !enabled },
  })

  return (
    <div style={{ borderRadius: 14, border: `1px solid ${enabled ? T.borderStrong : T.border}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: T.cardBg, gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.sectionTitleColor, flex: 1 }}>{label}</span>
        {enabled && headerExtra}
        <button
          type="button"
          onClick={toggle}
          role="switch"
          aria-checked={enabled}
          style={{ width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
            position: 'relative', background: enabled ? T.stepActiveBg : T.sliderTrack,
            padding: 0, transition: 'background 0.18s', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: 2, left: enabled ? 20 : 2, width: 16, height: 16,
            borderRadius: '50%', background: enabled ? T.stepActiveText : T.textFaint,
            transition: 'left 0.18s', display: 'block' }} />
        </button>
      </div>
      {enabled && (
        <div style={{ padding: '2px 14px 14px', borderTop: `1px solid ${T.border}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Shared DnD helper ── */
function useSectionSort(formData, updateForm, section) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const order = getFieldOrder(formData, section)
  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIdx = order.indexOf(active.id)
    const newIdx = order.indexOf(over.id)
    updateForm({
      fieldOrder: {
        ...(formData.fieldOrder || DEFAULT_FIELD_ORDER),
        [section]: arrayMove(order, oldIdx, newIdx),
      },
    })
  }
  return { sensors, order, onDragEnd }
}

function DragHint() {
  const T = useBuilderTheme()
  return (
    <p style={{ fontSize: 11, color: T.textFaint, textAlign: 'center', marginTop: 6, letterSpacing: '0.02em' }}>
      ⠿ Hold and drag to reorder fields
    </p>
  )
}

/* ── Step 1: Personal ── */
function Step1({ formData, updateForm }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
  const personal = useSectionSort(formData, updateForm, 'personal')
  const horoscope = useSectionSort(formData, updateForm, 'horoscope')

  const personalFields = {
    fullName:            <Field label={t('f_fullName')}    name="fullName"    formData={formData} updateForm={updateForm} placeholder={t('ph_fullName')} />,
    gender:              <Field label={t('f_gender')}      name="gender"      formData={formData} updateForm={updateForm} options={['', 'Male', 'Female']} />,
    dateOfBirth:         <Field label={t('f_dob')}         name="dateOfBirth" formData={formData} updateForm={updateForm} type="date" />,
    age:                 <Field label={t('f_age')}         name="age"         formData={formData} updateForm={updateForm} placeholder={t('ph_age')} />,
    height:              <Field label={t('f_height')}      name="height"      formData={formData} updateForm={updateForm} placeholder={t('ph_height')} />,
    weight:              <Field label={t('f_weight')}      name="weight"      formData={formData} updateForm={updateForm} placeholder={t('ph_weight')} />,
    bloodGroup:          <Field label={t('f_bloodGroup')}  name="bloodGroup"  formData={formData} updateForm={updateForm} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />,
    religion:            <Field label={t('f_religion')}    name="religion"    formData={formData} updateForm={updateForm} placeholder={t('ph_religion')} />,
    caste:               <Field label={t('f_caste')}       name="caste"       formData={formData} updateForm={updateForm} placeholder={t('ph_caste')} />,
    subCaste:            <Field label={t('f_subCaste')}    name="subCaste"    formData={formData} updateForm={updateForm} placeholder={t('ph_subCaste')} />,
    motherTongue:        <Field label={t('f_motherTongue')} name="motherTongue" formData={formData} updateForm={updateForm} placeholder={t('ph_motherTongue')} />,
  }

  const horoscopeFields = {
    rashi:    <Field label={t('f_rashi')}     name="rashi"     formData={formData} updateForm={updateForm} placeholder={t('ph_rashi')} />,
    nakshatra:<Field label={t('f_nakshatra')} name="nakshatra" formData={formData} updateForm={updateForm} placeholder={t('ph_nakshatra')} />,
    gotra:    <Field label={t('f_gotra')}     name="gotra"     formData={formData} updateForm={updateForm} placeholder={t('ph_gotra')} />,
    manglik:  <Field label={t('f_manglik')}   name="manglik"   formData={formData} updateForm={updateForm} options={['', 'No', 'Yes', 'Partial']} />,
  }

  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s1_title')} sub={t('b_s1_sub')} />

      <DndContext sensors={personal.sensors} collisionDetection={closestCenter} onDragEnd={personal.onDragEnd}>
        <SortableContext items={personal.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {personal.order.map(id => (
              <SortableFieldRow key={id} id={id}>
                {personalFields[id]}
              </SortableFieldRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <DragHint />

      {/* Optional sections — togglable */}
      <SectionToggle sectionKey="about" label="About Yourself" formData={formData} updateForm={updateForm}>
        <textarea name="about" className="form-input resize-none" rows={3}
          placeholder="Share a little about your personality, values, and interests…"
          value={formData.about} onChange={e => updateForm({ about: e.target.value })} />
      </SectionToggle>

      <SectionToggle sectionKey="partnerExpectations" label="Partner Expectations" formData={formData} updateForm={updateForm}>
        <textarea name="partnerExpectations" className="form-input resize-none" rows={3}
          placeholder="What are you looking for in a life partner?"
          value={formData.partnerExpectations || ''} onChange={e => updateForm({ partnerExpectations: e.target.value })} />
      </SectionToggle>


      <SectionToggle sectionKey="horoscope" label="Horoscope Details" formData={formData} updateForm={updateForm}>
        <DndContext sensors={horoscope.sensors} collisionDetection={closestCenter} onDragEnd={horoscope.onDragEnd}>
          <SortableContext items={horoscope.order} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {horoscope.order.map(id => (
                <SortableFieldRow key={id} id={id}>
                  {horoscopeFields[id]}
                </SortableFieldRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <DragHint />
        <div style={{ marginTop: 16 }}>
          <InlineCustomFields section="horoscope" titleKey="extra_horoscope_t" formData={formData} updateForm={updateForm} />
        </div>
      </SectionToggle>
    </div>
  )
}

/* ── Step 2: Education & Career ── */
function Step2({ formData, updateForm }) {
  const { t } = useLanguage()
  const career = useSectionSort(formData, updateForm, 'career')

  const careerContent = {
    education:   <Field label={t('f_education')}    name="education"   formData={formData} updateForm={updateForm} placeholder={t('ph_education')} />,
    college:     <Field label={t('f_college')}      name="college"     formData={formData} updateForm={updateForm} placeholder={t('ph_college')} />,
    occupation:  <Field label={t('f_occupation')}   name="occupation"  formData={formData} updateForm={updateForm} placeholder={t('ph_occupation')} />,
    company:     <Field label={t('f_company')}      name="company"     formData={formData} updateForm={updateForm} placeholder={t('ph_company')} />,
    income:      <Field label={t('f_income')}       name="income"      formData={formData} updateForm={updateForm} placeholder={t('ph_income')} />,
    workLocation:<Field label={t('f_workLocation')} name="workLocation" formData={formData} updateForm={updateForm} placeholder={t('ph_workLocation')} />,
  }

  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s2_title')} sub={t('b_s2_sub')} />
      <DndContext sensors={career.sensors} collisionDetection={closestCenter} onDragEnd={career.onDragEnd}>
        <SortableContext items={career.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {career.order.map(id => (
              <SortableFieldRow key={id} id={id}>
                {careerContent[id]}
              </SortableFieldRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <DragHint />
      <InlineCustomFields section="career" titleKey="extra_career_t" formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Step 3: Family ── */
function Step3({ formData, updateForm }) {
  const { t } = useLanguage()
  const family = useSectionSort(formData, updateForm, 'family')

  const familyContent = {
    fatherName:      <Field label={t('f_fatherName')}   name="fatherName"      formData={formData} updateForm={updateForm} placeholder={t('ph_fatherName')} />,
    fatherOccupation:<Field label={t('f_fatherOcc')}    name="fatherOccupation" formData={formData} updateForm={updateForm} placeholder={t('ph_fatherOcc')} />,
    motherName:      <Field label={t('f_motherName')}   name="motherName"      formData={formData} updateForm={updateForm} placeholder={t('ph_motherName')} />,
    motherOccupation:<Field label={t('f_motherOcc')}    name="motherOccupation" formData={formData} updateForm={updateForm} placeholder={t('ph_motherOcc')} />,
    brothers:        <Field label={t('f_brothers')}     name="brothers"        formData={formData} updateForm={updateForm} placeholder={t('ph_brothers')} />,
    sisters:         <Field label={t('f_sisters')}      name="sisters"         formData={formData} updateForm={updateForm} placeholder={t('ph_sisters')} />,
    familyType:      <Field label={t('f_familyType')}   name="familyType"      formData={formData} updateForm={updateForm} options={['', 'Nuclear', 'Joint', 'Extended']} />,
    familyStatus:    <Field label={t('f_familyStatus')} name="familyStatus"    formData={formData} updateForm={updateForm} options={['', 'Middle Class', 'Upper Middle Class', 'Business Family', 'Affluent']} />,
    nativePlace:     <Field label={t('f_nativePlace')}  name="nativePlace"     formData={formData} updateForm={updateForm} placeholder={t('ph_nativePlace')} />,
  }

  return (
    <div className="space-y-5">
      <StepHeading title={t('b_s3_title')} sub={t('b_s3_sub')} />
      <DndContext sensors={family.sensors} collisionDetection={closestCenter} onDragEnd={family.onDragEnd}>
        <SortableContext items={family.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {family.order.map(id => (
              <SortableFieldRow key={id} id={id}>
                {familyContent[id]}
              </SortableFieldRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <DragHint />
      <InlineCustomFields section="family" titleKey="extra_family_t" formData={formData} updateForm={updateForm} />
    </div>
  )
}

/* ── Step 4: Contact ── */
function Step4({ formData, updateForm }) {
  const { t } = useLanguage()
  const contact = useSectionSort(formData, updateForm, 'contact')

  const contactContent = {
    phone:   <Field label={t('f_phone')}   name="phone"   formData={formData} updateForm={updateForm} placeholder={t('ph_phone')} />,
    email:   <Field label={t('f_email')}   name="email"   formData={formData} updateForm={updateForm} type="email" placeholder={t('ph_email')} />,
    city:    <Field label={t('f_city')}    name="city"    formData={formData} updateForm={updateForm} placeholder={t('ph_city')} />,
    state:   <Field label={t('f_state')}   name="state"   formData={formData} updateForm={updateForm} placeholder={t('ph_state')} />,
    address: <Field label={t('f_address')} name="address" formData={formData} updateForm={updateForm} placeholder={t('ph_address')} />,
  }

  return (
    <div className="space-y-5">
      <StepHeading title="Contact Information" sub="How families can reach you" />
      <DndContext sensors={contact.sensors} collisionDetection={closestCenter} onDragEnd={contact.onDragEnd}>
        <SortableContext items={contact.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {contact.order.map(id => (
              <SortableFieldRow key={id} id={id}>
                {contactContent[id]}
              </SortableFieldRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <DragHint />
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
  const T = useBuilderTheme()
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
          <span style={{ fontFamily: 'serif', fontSize: 14, color: T.accentGold, letterSpacing: '0.12em' }}>
            {slogan}
          </span>
        )}
        {isHidden && (
          <span style={{ fontSize: 14, color: T.textFaint }}>No slogan will appear</span>
        )}
      </div>
      <p style={{ fontSize: 12, color: T.textFaint }}>
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
  const T = useBuilderTheme()
  const previewData = { ...DESIGN_SAMPLE, template: style.id }
  return (
    <div
      onClick={() => style.live && onSelect(style)}
      style={{ width: 180, flexShrink: 0, cursor: style.live ? 'pointer' : 'default' }}
    >
      <div style={{
        height: 252, borderRadius: 16, overflow: 'hidden', position: 'relative',
        border: isSelected ? '2px solid rgba(237,137,54,0.8)' : `1.5px solid ${T.border}`,
        boxShadow: isSelected ? '0 0 0 3px rgba(237,137,54,0.18), 0 12px 32px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.12)',
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
          <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: 'rgba(237,137,54,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(237,137,54,0.4)' }}>
            <Check size={13} color="#fff" />
          </div>
        )}
      </div>
      <div style={{ padding: '8px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? T.text : T.textMuted }}>{style.name}</span>
        {style.live
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: 20 }}>Live</span>
          : <span style={{ fontSize: 9, fontWeight: 600, color: T.textFaint, padding: '2px 4px', borderRadius: 20 }}>Soon</span>
        }
      </div>
    </div>
  )
}

/* 2-row grid scroller — scroll-aware ghost arrows, framer-motion fades */
function BuilderTemplateRow({ styles, formData, onSelect }) {
  const T = useBuilderTheme()
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
            style={{ background: T.scrollFadeLeft }}>
            <motion.button
              onClick={() => scrollTo(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: T.textFaint, display: 'flex' }}
              whileHover={{ scale: 1.3 }}
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
            style={{ background: T.scrollFadeRight }}>
            <motion.button
              onClick={() => scrollTo(1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: T.textFaint, display: 'flex' }}
              whileHover={{ scale: 1.3 }}
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
  const T = useBuilderTheme()
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
          style={{ width: 130, height: 158, cursor: 'grab', border: '2px solid rgba(200,150,12,0.5)', borderRadius: 12 }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          <img
            src={photo} alt="preview" draggable={false}
            className="w-full h-full pointer-events-none"
            style={{ objectFit: 'cover', objectPosition: `${position.x}% ${position.y}%` }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#fff', padding: '4px 0', background: 'rgba(0,0,0,0.45)' }}>
            {t('photo_drag')}
          </div>
        </div>
        <p style={{ fontSize: 12, color: T.textFaint, textAlign: 'center' }}>{t('photo_drag_hint')}</p>
      </div>
      <div style={{ fontSize: 14, color: T.textMuted, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
        <p>{t('photo_uploaded')}</p>
        <p style={{ fontSize: 12, color: T.textFaint }}>{t('photo_drag_sub')}</p>
        <button onClick={onReplace} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: T.accentGold, background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = T.accentGold} onMouseLeave={e => e.currentTarget.style.color = T.accentGold}>
          <RotateCcw className="w-3 h-3" /> {t('photo_change')}
        </button>
        <button onClick={onRemove} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>
          {t('photo_remove')}
        </button>
      </div>
    </div>
  )
}

/* ── Step 5: Photo & Slogan ── */
function Step5({ formData, updateForm }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
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
        <SectionTitle>{t('sec_photo')} <span style={{ fontSize: 14, color: T.textFaint, fontWeight: 400 }}>({t('sec_optional')})</span></SectionTitle>
        {formData.photo ? (
          <PhotoAdjuster
            photo={formData.photo}
            position={formData.photoPosition ?? { x: 50, y: 20 }}
            onPositionChange={(pos) => updateForm({ photoPosition: pos })}
            onRemove={() => { track.photoRemoved(); updateForm({ photo: null, photoPosition: { x: 50, y: 20 } }) }}
            onReplace={() => fileRef.current?.click()}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: 112, height: 112, borderRadius: 16, border: `2px dashed ${T.photoBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: T.photoBg, overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(237,137,54,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.photoBorder}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: T.photoText }}>
                <span style={{ fontSize: 30 }}>📷</span>
                <span style={{ fontSize: 12, textAlign: 'center' }}>{t('photo_upload_btn')}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, color: T.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p>{t('photo_hint')}</p>
              <p style={{ fontSize: 12, color: T.textFaint }}>{t('photo_fmt')}</p>
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
  const T = useBuilderTheme()
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.textFaint }}>Your Biodata</p>
        {selectedStyle && (
          <span style={{ fontSize: 12, fontWeight: 600, color: T.accentGold,
            background: T.accentGoldMuted, border: `1px solid ${T.borderStrong}`,
            borderRadius: 100, padding: '3px 12px' }}>
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
          border: `1.5px solid ${T.borderStrong}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
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
      <p style={{ fontSize: 10, color: T.textFaint, textAlign: 'center', marginTop: 8 }}>Updates instantly as you select</p>
    </div>
  )
}

/* ── Side panel preview — responsive A4 card, scrollable inside when content overflows ── */
function SidePanelPreview({ formData }) {
  const T = useBuilderTheme()
  const outerRef = useRef(null)
  const innerRef = useRef()
  const [panelW, setPanelW] = useState(() =>
    typeof window !== 'undefined' ? Math.min(420, window.innerWidth - 48) : 420
  )
  const [contentH, setContentH] = useState(0)
  const naturalW = 760

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return
    const update = () => { const w = el.offsetWidth; if (w > 0) setPanelW(w) }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!innerRef.current) return
    const h = innerRef.current.scrollHeight
    if (h > 0) setContentH(h)
  })

  const scale = panelW / naturalW
  const a4H = Math.round(naturalW * 1.414)
  const cardH = Math.round(panelW * 1.414)
  const scrollTrackH = contentH > 0 ? Math.round(contentH * scale) : cardH

  return (
    <div ref={outerRef} style={{ width: '100%' }}>
      {/* Clip layer — hard clips at panelW, hides the scrollbar sitting 20px to the right */}
      <div style={{
        width: panelW,
        height: cardH,
        overflow: 'hidden',
        borderRadius: 10,
        border: `1.5px solid ${T.borderStrong}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        isolation: 'isolate',
      }}>
        {/* Scroll layer — 20px wider than clip so native scrollbar is hidden behind the clip */}
        <div style={{
          width: panelW + 20,
          height: cardH,
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}>
          {/* Scroll track — explicit height at scaled proportions so scroll distance is correct */}
          <div style={{ width: panelW, height: scrollTrackH, position: 'relative' }}>
            <div ref={innerRef} style={{
              width: naturalW,
              minHeight: a4H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
            }}>
              <BioTemplate data={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ── Template preview modal for the builder design step ── */
function BuilderTemplateModal({ s, formData, onClose, onSelect }) {
  const T = useBuilderTheme()
  const [current, setCurrent] = useState(s)
  const initialGroupIdx = TEMPLATE_GROUPS.findIndex(g => g.ids.includes(s.id))
  const [activeGroup, setActiveGroup] = useState(initialGroupIdx === -1 ? 0 : initialGroupIdx)
  const stripRef = useRef(null)

  const vw = typeof window !== 'undefined' ? window.innerWidth : 480
  const isMobile = vw < 640
  const outerPad = isMobile ? 12 : 24
  const previewW = Math.min(380, vw - outerPad * 2 - 56)

  const groupStyles = TEMPLATE_GROUPS[activeGroup].ids
    .map(id => TEMPLATE_STYLES.find(st => st.id === id))
    .filter(Boolean)


  useEffect(() => {
    if (stripRef.current) stripRef.current.scrollLeft = 0
  }, [activeGroup])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const idx = groupStyles.findIndex(st => st.id === current.id)
    if (idx === -1) return
    const thumb = strip.children[idx]
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [current.id])

  const handleSelect = () => {
    track.templateSelected(current.id, current.name)
    onSelect(current.id)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: outerPad }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: T.modalBg, borderRadius: isMobile ? 20 : 24, overflow: 'hidden',
          border: `1px solid ${T.modalBorder}`, width: '100%', maxWidth: 860,
          maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '12px 16px' : '14px 24px',
          borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: isMobile ? 18 : 20, flexShrink: 0 }}>{current.symbol}</span>
            <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: T.text, fontFamily: 'serif',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.textFaint,
              background: T.cardBg, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
              {current.desc}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%',
            border: `1px solid ${T.borderStrong}`, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.textFaint, flexShrink: 0, marginLeft: 10 }}>
            <X size={14} />
          </button>
        </div>

        {/* Scrollable preview */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center',
          padding: isMobile ? '16px 16px 12px' : '24px 28px 16px',
          background: T.modalBodyBg }}>
          <AnimatePresence mode="wait">
            <motion.div key={current.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              <LivePreview containerW={previewW} shadow={false} template={current.id} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Group tabs + thumbnail strip */}
        <div style={{ flexShrink: 0, borderTop: `1px solid ${T.border}`, background: T.cardBg2 }}>
          {/* Group tabs */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 8px',
            overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="[&::-webkit-scrollbar]:hidden">
            {TEMPLATE_GROUPS.map((group, gi) => (
              <button key={group.label} onClick={() => setActiveGroup(gi)} style={{
                padding: '5px 13px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                background: activeGroup === gi ? T.stepActiveBg : T.stepIdleBg,
                color: activeGroup === gi ? T.stepActiveText : T.stepIdleText,
                border: `1px solid ${activeGroup === gi ? T.stepActiveBorder : T.stepIdleBorder}`,
                transition: 'all 0.18s',
              }}>
                {group.label}
                <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.6 }}>{group.ids.length}</span>
              </button>
            ))}
          </div>
          {/* Thumbnails */}
          <div ref={stripRef}
            style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 16px 12px',
              scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="[&::-webkit-scrollbar]:hidden">
            {groupStyles.map(st => (
              <div key={st.id} onClick={() => setCurrent(st)}
                style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ borderRadius: 8, overflow: 'hidden',
                  border: `2px solid ${current.id === st.id ? 'rgba(237,137,54,0.75)' : T.border}`,
                  boxShadow: current.id === st.id ? '0 0 10px rgba(237,137,54,0.3)' : 'none',
                  transition: 'border-color 0.18s, box-shadow 0.18s' }}>
                  <LivePreview containerW={64} visibleH={90} shadow={false} template={st.id} />
                </div>
                <span style={{ fontSize: 10, fontWeight: current.id === st.id ? 700 : 400,
                  color: current.id === st.id ? '#ed8936' : T.textFaint,
                  whiteSpace: 'nowrap', transition: 'color 0.18s' }}>
                  {st.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ flexShrink: 0, padding: isMobile ? '12px 16px 18px' : '14px 24px 20px',
          borderTop: `1px solid ${T.border}`, background: T.modalBg,
          display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleSelect}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: isMobile ? '11px 28px' : '13px 40px', fontSize: 15, fontWeight: 600,
              borderRadius: 12, cursor: 'pointer', width: '100%', maxWidth: 340, justifyContent: 'center',
              background: T.stepActiveBg, border: `1.5px solid ${T.stepActiveBorder}`,
              color: T.stepActiveText, transition: 'all 0.2s' }}>
            <Check size={16} /> Use this template
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Step6({ formData, updateForm }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
  const [previewStyle, setPreviewStyle] = useState(null)
  const selectedStyle = TEMPLATE_STYLES.find(s => s.id === (formData.template || 'lotus'))
  const previewFormData = {
    ...(formData.fullName ? formData : DESIGN_SAMPLE),
    template: formData.template || 'lotus',
  }

  return (
    <div className="space-y-6">
      <StepHeading title={t('b_s6_title')} sub={t('b_s6_sub')} />

      <div className="space-y-6">

        {/* All groups shown — each with a section label */}
        {TEMPLATE_GROUPS.map(group => {
          const groupStyles = group.ids
            .map(id => TEMPLATE_STYLES.find(st => st.id === id))
            .filter(Boolean)
          return (
            <div key={group.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
                  textTransform: 'uppercase', color: T.textFaint, whiteSpace: 'nowrap' }}>
                  {group.label}
                </span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span style={{ fontSize: 10, color: T.textFaint, flexShrink: 0 }}>
                  {groupStyles.length}
                </span>
              </div>
              <BuilderTemplateRow
                styles={groupStyles}
                formData={formData}
                onSelect={style => setPreviewStyle(style)}
              />
            </div>
          )
        })}

        {/* Selected info chip */}
        {selectedStyle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12,
            border: `1px solid ${T.borderStrong}`, background: T.cardBg, padding: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: selectedStyle.gradient, flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{selectedStyle.name}</p>
              <p style={{ fontSize: 12, color: T.textFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedStyle.desc}</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 100, padding: '4px 12px', flexShrink: 0 }}>
              {t('design_selected')}
            </span>
          </div>
        )}

        {/* Mobile-only preview */}
        <div className="sm:hidden mt-2">
          <div style={{ maxHeight: 288, overflow: 'hidden', borderRadius: 12 }}>
            <motion.div key={formData.template || 'lotus'}
              initial={{ opacity: 0.7, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <DesignLivePreview formData={previewFormData} />
            </motion.div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: T.textFaint, marginTop: 8 }}>
            ↑ preview clipped · tap Preview in nav for full view
          </p>
        </div>

      </div>

      {/* Template preview modal */}
      <AnimatePresence>
        {previewStyle && (
          <BuilderTemplateModal
            s={previewStyle}
            formData={formData}
            onClose={() => setPreviewStyle(null)}
            onSelect={id => updateForm({ template: id })}
          />
        )}
      </AnimatePresence>
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
  const T = useBuilderTheme()
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
          background: T.modalBg,
          border: `1px solid ${T.modalBorder}`,
          borderRadius: 24, padding: '32px 28px',
          maxWidth: 380, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        {state.succeeded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '8px 0' }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🙏</div>
            <p style={{ color: T.text, fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{t('prev_thank_you')}</p>
          </motion.div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: 'spring', damping: 12, stiffness: 260, delay: 0.08 }}
                style={{ fontSize: 52, marginBottom: 10 }}
              >✅</motion.div>
              <p style={{ color: T.text, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{t('prev_ready')}</p>
              <p style={{ color: T.textMuted, fontSize: 13 }}>{t('prev_how_was')}</p>
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
                    background: rating === r.score ? T.stepActiveBg : T.cardBg,
                    outline: rating === r.score ? `1.5px solid ${T.stepActiveBorder}` : '1.5px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: 28, lineHeight: 1, filter: rating !== null && rating !== r.score ? 'grayscale(1) opacity(0.35)' : 'none', transition: 'filter 0.15s' }}>
                      {r.emoji}
                    </span>
                    <span style={{ fontSize: 9, color: rating === r.score ? T.stepActiveText : T.textFaint, fontWeight: 600, letterSpacing: '0.04em' }}>
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
                    <button type="submit" disabled={state.submitting}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 600,
                        borderRadius: 12, cursor: 'pointer', marginBottom: 8,
                        background: T.stepActiveBg, border: `1.5px solid ${T.stepActiveBorder}`,
                        color: T.stepActiveText }}>
                      {state.submitting ? t('prev_fb_sending') : t('prev_fb_send')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button" onClick={onClose}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  color: T.textFaint, fontSize: 13, padding: '8px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = T.textMuted}
                onMouseLeave={e => e.target.style.color = T.textFaint}
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
  const T = useBuilderTheme()
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: T.text, margin: 0 }}>{t('prev_title')}</h2>
          <p style={{ color: T.textMuted, fontSize: 14, marginTop: 4 }}>{t('prev_sub')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {downloaded && (
            <button
              onClick={handleShare}
              disabled={sharing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#16a34a' }}
            >
              <MessageCircle size={16} />
              {sharing ? t('prev_preparing') : t('prev_share')}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: T.stepActiveBg, border: `1.5px solid ${T.stepActiveBorder}`, color: T.stepActiveText }}
          >
            {loading ? (
              <><span>⏳</span> {t('prev_generating')}</>
            ) : downloaded ? (
              <><Check size={18} /> {t('prev_again')}</>
            ) : (
              <><Download size={18} /> {t('prev_download')}</>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }} className="md:grid-cols-6">
        {steps.map((label, index) => (
          <button
            key={index}
            onClick={() => onEditStep(index)}
            style={{ borderRadius: 12, border: `1px solid ${T.borderStrong}`, background: T.previewEditBg, padding: '10px 12px', textAlign: 'left', fontSize: 14, color: T.previewEditText, cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.stepActiveBorder}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.borderStrong}
          >
            <span style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.previewEditLabel, marginBottom: 4 }}>{t('prev_edit_label')}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Biodata preview — same card view as the live preview panel */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <SidePanelPreview formData={applyEnabledSections(formData)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: T.cardBg, border: `1.5px solid ${T.borderStrong}`, color: T.text }}>
          <ChevronLeft size={16} /> {t('prev_edit_details')}
        </button>
        <button onClick={handleDownload} disabled={loading}
          style={{ display: 'inline-flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: T.stepActiveBg, border: `1.5px solid ${T.stepActiveBorder}`, color: T.stepActiveText }}>
          {loading ? t('prev_generating') : <><Download size={18} /> {downloaded ? t('prev_again') : t('prev_download')}</>}
        </button>
        {downloaded && (
          <button onClick={handleShare} disabled={sharing}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#16a34a' }}>
            <MessageCircle size={16} /> {sharing ? t('prev_preparing') : t('prev_whatsapp')}
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
  const T = useBuilderTheme()
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
        <div style={{ width: 3, height: 22, borderRadius: 2,
          background: T.accentBar, flexShrink: 0 }} />
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px, 3vw, 22px)',
          fontWeight: 700, color: T.text, margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13, color: T.textFaint, paddingLeft: 13 }}>{sub}</p>
    </div>
  )
}

function SectionTitle({ children }) {
  const T = useBuilderTheme()
  return <h3 style={{ fontSize: 11, fontWeight: 700, color: T.accentGold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</h3>
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
  const { theme } = useTheme()
  const T = useBuilderTheme()
  const [step, setStep] = useState(0)
  const [pendingFocus, setPendingFocus] = useState('')
  const [showDesignModal, setShowDesignModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const savedFlashTimer = useRef(null)
  const downloadRef = useRef(null)

  useEffect(() => {
    if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current)
    setSavedFlash(true)
    savedFlashTimer.current = setTimeout(() => setSavedFlash(false), 2200)
    return () => clearTimeout(savedFlashTimer.current)
  }, [formData])

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

  const canNext = () => true

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

  const previewFormData = useMemo(() => applyEnabledSections({
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
    <div className="min-h-screen" data-theme={theme} style={{ background: T.pageBg }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: T.headerBg, backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 clamp(12px, 3vw, 20px)',
          display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', height: 'clamp(52px, 7vh, 64px)' }}>
          <button onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8,
              color: T.backBtnColor, display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = T.backBtnHoverColor; e.currentTarget.style.background = T.backBtnHoverBg; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.backBtnColor; e.currentTarget.style.background = 'none'; }}>
            <ChevronLeft style={{ width: 20, height: 20 }} />
          </button>
          <button
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Go to home page"
          >
            <div style={{ width: 30, height: 30, borderRadius: 9,
              background: T.logoIconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: T.logoIconShadow }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: T.logoIconColor, lineHeight: 1 }}>B</span>
            </div>
            <span className="hidden sm:inline" style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>Bandhan</span>
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSwitcher compact />
            <span className="hidden sm:flex" style={{
              alignItems: 'center', gap: 6, fontSize: 12,
              color: savedFlash ? T.savedFlashColor : T.savedFlashDim,
              transition: 'color 0.4s ease',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
                background: savedFlash ? '#34d399' : 'rgba(52,211,153,0.3)',
                boxShadow: savedFlash ? '0 0 6px rgba(52,211,153,0.6)' : 'none',
                transition: 'all 0.4s ease',
              }} />
              {t('b_auto_saved')}
            </span>
            {!isPreview && (
              <div style={{ fontSize: 13, color: T.stepCountText, fontWeight: 500,
                background: T.stepCountBg, padding: '4px 12px', borderRadius: 100,
                border: `1px solid ${T.stepCountBorder}` }}>
                {t('b_step')} {step + 1} / {totalSteps}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-5 md:px-6 py-4 sm:py-6 md:py-10">
        {!isPreview && (
          <div style={{ position: 'sticky', top: 'clamp(52px, 7vh, 64px)', zIndex: 20, margin: '0 -8px',
            marginBottom: 24, borderBottom: `1px solid ${T.border}`,
            background: T.stickyBg, backdropFilter: 'blur(20px)',
            padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 3vw, 20px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {STEPS.map((section, index) => (
                  <button key={section.label} onClick={() => setStep(index)} style={{
                    padding: '6px 15px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                    background: step === index ? T.stepActiveBg : T.stepIdleBg,
                    color: step === index ? T.stepActiveText : T.stepIdleText,
                    border: `1px solid ${step === index ? T.stepActiveBorder : T.stepIdleBorder}`,
                  }}>
                    {section.label}
                  </button>
                ))}
                <button onClick={() => setShowDesignModal(true)} className="sm:hidden"
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 100,
                    fontSize: 11, fontWeight: 600, background: T.stepIdleBg,
                    color: T.stepIdleText, border: `1px solid ${T.stepIdleBorder}`,
                    cursor: 'pointer', transition: 'all 0.2s' }}>
                  <LayoutTemplate style={{ width: 11, height: 11 }} />
                  Templates
                </button>
              </div>
              <label className="md:self-end md:w-72" style={{ position: 'relative', display: 'block' }}>
                <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 14, height: 14, color: T.textFaint, pointerEvents: 'none' }} />
                <select className="form-select text-sm" style={{ paddingLeft: '2.5rem' }}
                  value="" onChange={event => jumpToField(event.target.value)}
                  aria-label="Jump to a specific biodata field">
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
                  <div style={{ height: 1, width: 32, transition: 'background 0.3s', background: i < step ? T.stepActiveBorder : T.border }} />
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

              <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
                <button onClick={prev}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, borderRadius: 12, cursor: 'pointer', background: T.cardBg, border: `1.5px solid ${T.borderStrong}`, color: T.text }}>
                  <ChevronLeft style={{ width: 16, height: 16 }} />
                  {step === 0 ? t('b_home') : t('b_back')}
                </button>
                <button onClick={next} disabled={!canNext()}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '13px 24px', fontSize: 15, borderRadius: 14, fontWeight: 600, cursor: !canNext() ? 'not-allowed' : 'pointer',
                    background: T.stepActiveBg, border: `1.5px solid ${T.stepActiveBorder}`, color: T.stepActiveText,
                    opacity: !canNext() ? 0.45 : 1 }}>
                  {step === totalSteps - 1 ? (
                    <><span>{t('b_preview_btn')}</span> <Check style={{ width: 16, height: 16 }} /></>
                  ) : (
                    <><span>{t('b_continue')}</span> <ChevronRight style={{ width: 16, height: 16 }} /></>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: live preview — exactly card width, no extra space */}
            <div className="hidden sm:flex flex-col items-end sticky top-20 self-start sm:w-[260px] md:w-[320px] lg:w-[420px]" style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 12 }}>
                <button onClick={() => setShowDesignModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 100,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', cursor: 'pointer',
                    background: theme === 'light' ? '#0a0a0a' : T.stepIdleBg,
                    color: theme === 'light' ? '#ffffff' : T.stepIdleText,
                    border: theme === 'light' ? '1px solid #0a0a0a' : `1px solid ${T.stepIdleBorder}`,
                    transition: 'all 0.2s' }}
                  onMouseEnter={e => {
                    if (theme === 'light') { e.currentTarget.style.background = '#333'; e.currentTarget.style.borderColor = '#333'; }
                    else { e.currentTarget.style.background = T.stepActiveBg; e.currentTarget.style.borderColor = T.stepActiveBorder; e.currentTarget.style.color = T.stepActiveText; }
                  }}
                  onMouseLeave={e => {
                    if (theme === 'light') { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.borderColor = '#0a0a0a'; }
                    else { e.currentTarget.style.background = T.stepIdleBg; e.currentTarget.style.borderColor = T.stepIdleBorder; e.currentTarget.style.color = T.stepIdleText; }
                  }}>
                  <LayoutTemplate style={{ width: 12, height: 12 }} />
                  Templates
                </button>
                <button onClick={handleQuickDownload} disabled={downloading}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 100,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
                    cursor: downloading ? 'default' : 'pointer',
                    background: theme === 'light' ? '#0a0a0a' : 'rgba(34,197,94,0.08)',
                    color: theme === 'light' ? '#ffffff' : '#22c55e',
                    border: theme === 'light' ? '1px solid #0a0a0a' : '1px solid rgba(34,197,94,0.2)',
                    transition: 'all 0.2s', opacity: downloading ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!downloading) e.currentTarget.style.background = theme === 'light' ? '#333' : 'rgba(34,197,94,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = theme === 'light' ? '#0a0a0a' : 'rgba(34,197,94,0.08)'; }}>
                  <Download style={{ width: 12, height: 12 }} />
                  {downloading ? 'Saving…' : 'Download'}
                </button>
                <p style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textFaint }}>Live Preview</p>
              </div>
              <motion.div
                key={formData.template || 'lotus'}
                initial={{ opacity: 0.7, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
              >
                <SidePanelPreview formData={previewFormData} />
              </motion.div>
              <p style={{ fontSize: 10, color: T.textFaint, marginTop: 8 }}>
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
          <BuilderTemplateModal
            s={TEMPLATE_STYLES.find(s => s.id === (formData.template || 'lotus')) || TEMPLATE_STYLES[0]}
            formData={formData}
            onClose={() => setShowDesignModal(false)}
            onSelect={id => updateForm({ template: id })}
          />
        )}
      </AnimatePresence>

      {/* Hidden template used for PDF export — no fixed height so all content is captured */}
      <div style={{ position: 'fixed', left: 0, top: 0, transform: 'translateX(-9999px)', pointerEvents: 'none' }}>
        <div ref={downloadRef} style={{ width: 760, minHeight: Math.round(760 * 1.414), position: 'relative' }}>
          <BioTemplate data={applyEnabledSections(formData)} />
        </div>
      </div>
    </div>
  )
}
