import { createContext, useContext, useState } from 'react'
import { translations, createT, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

function detectLang() {
  try {
    const saved = localStorage.getItem('bandhan_lang')
    if (saved && translations[saved]) return saved
    const browser = navigator.language?.split('-')[0]
    if (browser && translations[browser]) return browser
  } catch {}
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLang)

  const setLang = (code) => {
    if (!translations[code]) return
    setLangState(code)
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
