import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useBuilderTheme } from '../contexts/ThemeContext'
import { track } from '../utils/analytics'

// "What stopped you?": one tap when someone leaves the builder before finishing. Fixed reasons only
// (no free text, so nothing personal reaches analytics). Shown at most once per browser session.
const REASONS = ['looking', 'details', 'long', 'designs', 'format', 'privacy', 'language']
const SESSION_KEY = 'bandhan_exit_q'

export function exitSurveyAvailable() {
  try { return !sessionStorage.getItem(SESSION_KEY) } catch { return false }
}

export default function ExitSurvey({ lastStep, onClose }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
  const [answered, setAnswered] = useState(false)
  useEffect(() => { try { sessionStorage.setItem(SESSION_KEY, '1') } catch {} }, [])

  const pick = (reason) => {
    track.exitReason(reason, lastStep)
    setAnswered(true)
    setTimeout(onClose, 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 400, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 12 }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={t('exit_q_title')}
        style={{ width: '100%', maxWidth: 440, background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 20, padding: '18px 18px 16px', marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        {answered ? (
          <p style={{ fontSize: 15, fontWeight: 600, color: T.text, textAlign: 'center', padding: '18px 0' }}>{t('exit_thanks')}</p>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>{t('exit_q_title')}</p>
                <p style={{ fontSize: 12.5, color: T.textMuted, margin: '4px 0 0' }}>{t('exit_q_sub')}</p>
              </div>
              <button onClick={onClose} aria-label={t('exit_skip')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textFaint, padding: 2 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {REASONS.map(r => (
                <button key={r} onClick={() => pick(r)}
                  style={{ padding: '9px 13px', borderRadius: 999, fontSize: 13.5, cursor: 'pointer', background: T.cardBg, color: T.text, border: `1px solid ${T.borderStrong}` }}>
                  {t(`exit_r_${r}`)}
                </button>
              ))}
            </div>
            <button onClick={onClose}
              style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: T.textFaint }}>
              {t('exit_skip')}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
