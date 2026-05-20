import { createContext, useContext, useState } from 'react'
import { translations, createT, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

/* ── URL slug ↔ language code map ── */
export const LANG_SLUGS = {
  en: '',
  hi: 'hindi-biodata-maker',
  te: 'telugu-biodata-maker',
  ta: 'tamil-biodata-maker',
  kn: 'kannada-biodata-maker',
  ml: 'malayalam-biodata-maker',
  bn: 'bengali-biodata-maker',
  mr: 'marathi-biodata-maker',
  gu: 'gujarati-biodata-maker',
}

/* reverse map: slug → code */
const SLUG_TO_LANG = Object.fromEntries(
  Object.entries(LANG_SLUGS).map(([code, slug]) => [slug, code])
)

/* Page titles per language */
const PAGE_TITLES = {
  en: 'Bandhan — Free Indian Marriage Biodata Maker',
  hi: 'Bandhan — मुफ़्त हिंदी विवाह बायोडेटा मेकर',
  te: 'Bandhan — ఉచిత తెలుగు వివాహ బయోడేటా మేకర్',
  ta: 'Bandhan — இலவச தமிழ் திருமண பயோடேட்டா மேக்கர்',
  kn: 'Bandhan — ಉಚಿತ ಕನ್ನಡ ವಿವಾಹ ಬಯೋಡೇಟಾ ಮೇಕರ್',
  ml: 'Bandhan — സൗജന്യ മലയാളം വിവാഹ ബയോഡേറ്റ മേക്കർ',
  bn: 'Bandhan — বিনামূল্যে বাংলা বিয়ের বায়োডেটা মেকার',
  mr: 'Bandhan — मोफत मराठी विवाह बायोडेटा मेकर',
  gu: 'Bandhan — મફત ગુજરાતી લગ્ન બાયોડેટા મેકર',
}

function detectLang() {
  /* 1. URL path — highest priority (direct link or bookmark) */
  try {
    const slug = window.location.pathname.replace(/^\//, '').replace(/\/$/, '')
    if (slug && SLUG_TO_LANG[slug] && translations[SLUG_TO_LANG[slug]]) {
      return SLUG_TO_LANG[slug]
    }
  } catch {}

  /* 2. localStorage saved preference */
  try {
    const saved = localStorage.getItem('bandhan_lang')
    if (saved && translations[saved]) return saved
  } catch {}

  /* 3. Browser language */
  try {
    const browser = navigator.language?.split('-')[0]
    if (browser && translations[browser]) return browser
  } catch {}

  return 'en'
}

function applyLangToURL(code) {
  try {
    const slug = LANG_SLUGS[code] ?? ''
    const path = slug ? `/${slug}` : '/'
    if (window.location.pathname !== path) {
      history.replaceState(history.state, '', path)
    }
    document.title = PAGE_TITLES[code] ?? PAGE_TITLES.en
  } catch {}
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const detected = detectLang()
    /* Sync URL and title on initial load */
    applyLangToURL(detected)
    return detected
  })

  const setLang = (code) => {
    if (!translations[code]) return
    setLangState(code)
    applyLangToURL(code)
    try { localStorage.setItem('bandhan_lang', code) } catch {}
  }

  const t = createT(lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
