import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('bandhan_blog_theme', theme) } catch {}
  }, [theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

/* Shared color tokens — import and call in any component */
export function useBuilderTheme() {
  const { theme } = useContext(ThemeContext)
  return theme === 'light' ? LIGHT : DARK
}

const LIGHT = {
  pageBg: '#f8f9fa',
  headerBg: 'rgba(255,255,255,0.96)',
  stickyBg: 'rgba(248,249,250,0.98)',
  cardBg: '#ffffff',
  cardBg2: '#f3f4f6',
  cardBg3: '#e9ecef',
  border: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',
  text: '#0a0a0a',
  textMuted: '#4b5563',
  textFaint: '#9ca3af',
  stepActiveBg: '#0a0a0a',
  stepActiveText: '#ffffff',
  stepActiveBorder: '#0a0a0a',
  stepIdleBg: 'rgba(0,0,0,0.05)',
  stepIdleText: '#6b7280',
  stepIdleBorder: 'rgba(0,0,0,0.1)',
  accentGold: '#0a0a0a',
  accentGoldMuted: 'rgba(0,0,0,0.08)',
  scrollFadeLeft: 'linear-gradient(to right, #f8f9fa 35%, transparent)',
  scrollFadeRight: 'linear-gradient(to left, #f8f9fa 35%, transparent)',
  modalBg: '#ffffff',
  modalBorder: '#e5e7eb',
  modalBodyBg: '#f9fafb',
  backBtnColor: 'rgba(0,0,0,0.4)',
  backBtnHoverColor: 'rgba(0,0,0,0.75)',
  backBtnHoverBg: 'rgba(0,0,0,0.05)',
  savedFlashColor: '#16a34a',
  savedFlashDim: 'rgba(22,163,74,0.35)',
  stepCountBg: 'rgba(0,0,0,0.06)',
  stepCountBorder: 'rgba(0,0,0,0.08)',
  stepCountText: '#6b7280',
  sectionTitleColor: '#9ca3af',
  previewEditBg: '#ffffff',
  previewEditBorder: 'rgba(0,0,0,0.08)',
  previewEditText: '#374151',
  previewEditLabel: '#9ca3af',
  photoBorder: 'rgba(0,0,0,0.15)',
  photoBg: '#f3f4f6',
  photoText: '#9ca3af',
  sliderTrack: 'rgba(0,0,0,0.1)',
  customFieldBg: '#f9fafb',
  customFieldBorder: 'rgba(0,0,0,0.08)',
  globeBtn: { bg: 'transparent', border: 'rgba(0,0,0,0.15)', color: '#374151', hoverBg: 'rgba(0,0,0,0.04)', hoverBorder: 'rgba(0,0,0,0.28)', hoverColor: '#0a0a0a' },
  globeDropdown: { bg: '#ffffff', border: '#e5e7eb', shadow: '0 8px 24px rgba(0,0,0,0.12)', text: '#374151', textMuted: '#9ca3af', selectedBg: 'rgba(0,0,0,0.05)', selectedText: '#0a0a0a', hoverBg: 'rgba(0,0,0,0.04)' },
  logoIconBg: '#0a0a0a',
  logoIconShadow: '0 3px 12px rgba(0,0,0,0.18)',
  logoIconColor: '#ffffff',
  accentBar: '#0a0a0a',
  dragHandleColor: 'rgba(0,0,0,0.22)',
  dragHandleHover: 'rgba(0,0,0,0.55)',
}

const DARK = {
  pageBg: '#060608',
  headerBg: 'rgba(6,6,8,0.95)',
  stickyBg: 'rgba(6,6,8,0.97)',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBg2: '#0f0f1a',
  cardBg3: '#0a0a12',
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  textFaint: 'rgba(255,255,255,0.35)',
  stepActiveBg: 'rgba(200,150,12,0.15)',
  stepActiveText: '#F0B820',
  stepActiveBorder: 'rgba(200,150,12,0.38)',
  stepIdleBg: 'rgba(255,255,255,0.05)',
  stepIdleText: 'rgba(255,255,255,0.45)',
  stepIdleBorder: 'rgba(255,255,255,0.08)',
  accentGold: '#F0B820',
  accentGoldMuted: 'rgba(200,150,12,0.15)',
  scrollFadeLeft: 'linear-gradient(to right, #0a0a12 30%, transparent)',
  scrollFadeRight: 'linear-gradient(to left, #0a0a12 30%, transparent)',
  modalBg: '#0f0f1c',
  modalBorder: 'rgba(200,150,12,0.18)',
  modalBodyBg: 'rgba(201,160,53,0.02)',
  backBtnColor: 'rgba(255,255,255,0.35)',
  backBtnHoverColor: 'rgba(255,255,255,0.75)',
  backBtnHoverBg: 'rgba(255,255,255,0.06)',
  savedFlashColor: 'rgba(52,211,153,0.9)',
  savedFlashDim: 'rgba(52,211,153,0.35)',
  stepCountBg: 'rgba(255,255,255,0.05)',
  stepCountBorder: 'rgba(255,255,255,0.08)',
  stepCountText: 'rgba(255,255,255,0.38)',
  sectionTitleColor: 'rgba(255,255,255,0.3)',
  previewEditBg: 'rgba(255,255,255,0.04)',
  previewEditBorder: 'rgba(255,255,255,0.1)',
  previewEditText: 'rgba(255,255,255,0.7)',
  previewEditLabel: 'rgba(255,255,255,0.35)',
  photoBorder: 'rgba(255,255,255,0.2)',
  photoBg: 'rgba(255,255,255,0.05)',
  photoText: 'rgba(255,255,255,0.3)',
  sliderTrack: 'rgba(255,255,255,0.15)',
  customFieldBg: 'rgba(255,255,255,0.04)',
  customFieldBorder: 'rgba(255,255,255,0.08)',
  globeBtn: { bg: 'rgba(107,70,193,0.1)', border: 'rgba(107,70,193,0.35)', color: 'rgba(255,255,255,0.65)', hoverBg: 'rgba(237,137,54,0.1)', hoverBorder: 'rgba(237,137,54,0.6)', hoverColor: '#ed8936' },
  globeDropdown: { bg: '#0d0d14', border: 'rgba(255,255,255,0.08)', shadow: '0 16px 40px rgba(0,0,0,0.5)', text: 'rgba(255,255,255,0.7)', textMuted: 'rgba(255,255,255,0.45)', selectedBg: 'rgba(200,150,12,0.15)', selectedText: '#F0B820', hoverBg: 'rgba(255,255,255,0.05)' },
  logoIconBg: 'linear-gradient(135deg, #C8960C, #F0B820)',
  logoIconShadow: '0 3px 12px rgba(200,150,12,0.4)',
  logoIconColor: '#1a0a00',
  accentBar: 'linear-gradient(180deg, #F0B820, #C8960C)',
  dragHandleColor: 'rgba(255,255,255,0.18)',
  dragHandleHover: 'rgba(168,85,247,0.7)',
}
