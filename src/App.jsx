import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'

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
  // About & Horoscope
  hobbies: '', about: '',
  rashi: '', nakshatra: '', gotra: '', manglik: '',
  // Contact
  address: '', city: '', state: '', phone: '', email: '',
  // Photo & Template
  photo: null,
  photoPosition: { x: 50, y: 20 },
  template: 'panIndia',
  // User-defined rows
  customFields: [],
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

  const updateForm = (fields) => setFormData(prev => {
    const next = { ...prev, ...fields }
    try {
      // photo is base64 — too large for localStorage, skip it
      const { photo, ...rest } = next
      localStorage.setItem(LS_KEY, JSON.stringify(rest))
    } catch {}
    return next
  })

  const startBuilder = () => {
    setFormData(EMPTY_FORM)
    try { localStorage.removeItem(LS_KEY) } catch {}
    setView('builder')
  }

  const continueBuilder = () => setView('builder')

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
          onBack={() => setView('landing')}
        />
      )}
    </div>
  )
}
