import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'
import { track } from './utils/analytics'
import { DEFAULT_FIELD_ORDER } from './utils/fieldGroups'

const LS_KEY = 'bandhan_biodata_v1'

const EMPTY_FORM = {
  // Personal
  fullName: '', dateOfBirth: '', age: '', gender: '',
  height: '', weight: '', bloodGroup: '',
  religion: '', caste: '', subCaste: '', motherTongue: '',
  // Education & Career
  education: '', college: '', occupation: '',
  company: '', income: '', workLocation: '',
  // Family
  fatherName: '', fatherOccupation: '',
  motherName: '', motherOccupation: '',
  brothers: '', sisters: '',
  familyType: '', familyStatus: '', nativePlace: '',
  // About & Expectations
  about: '', partnerExpectations: '',
  rashi: '', nakshatra: '', gotra: '', manglik: '',
  // Contact
  address: '', city: '', state: '', phone: '', email: '',
  // Photo & Template
  photo: null,
  photoPosition: { x: 50, y: 20 },
  template: 'lotus',
  sloganLanguage: 'auto',
  // User-defined rows
  customFields: [],
  // Field display order (per section) — drag to reorder in the builder
  fieldOrder: DEFAULT_FIELD_ORDER,
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return { ...EMPTY_FORM, ...JSON.parse(raw) }
  } catch {
    return null
  }
}

export default function App() {
  const [view, setView] = useState('landing')
  const [formData, setFormData] = useState(() => loadSaved() ?? EMPTY_FORM)

  // Handle browser back button — popstate fires when user presses browser back
  useEffect(() => {
    const handlePopState = () => setView('landing')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateForm = (fields) => setFormData(prev => {
    const next = { ...prev, ...fields }
    try {
      const { photo, ...rest } = next
      localStorage.setItem(LS_KEY, JSON.stringify(rest))
    } catch {}
    return next
  })

  const goToBuilder = () => {
    // Push a history entry so browser back returns to landing, not Google
    history.pushState({ view: 'builder' }, '', '/')
    setView('builder')
  }

  const startBuilder = (styleId) => {
    track.builderStarted(styleId || 'lotus')
    setFormData({ ...EMPTY_FORM, template: styleId || 'lotus' })
    try { localStorage.removeItem(LS_KEY) } catch {}
    goToBuilder()
  }

  const continueBuilder = () => goToBuilder()

  const savedName = formData.fullName?.trim() || null

  return (
    <div className="min-h-screen">
      {view === 'landing' && (
        <LandingPage
          onStart={startBuilder}
          onContinue={continueBuilder}
          savedName={savedName}
        />
      )}
      {view === 'builder' && (
        <BuilderPage
          formData={formData}
          updateForm={updateForm}
          onBack={() => {
            // Use browser history.back() so popstate fires and view resets cleanly
            history.back()
          }}
        />
      )}
    </div>
  )
}
