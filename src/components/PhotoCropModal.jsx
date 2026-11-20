import { useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useBuilderTheme } from '../contexts/ThemeContext'

// Every template photo box is ~4:5 portrait; Noir/Aurora show the top of it in a circle
export const PHOTO_ASPECT = 4 / 5

// Profile-photo style crop dialog: fixed frame, drag the photo under it, pinch/wheel/slider to zoom.
export default function PhotoCropModal({ image, initialArea, onApply, onCancel }) {
  const { t } = useLanguage()
  const T = useBuilderTheme()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const apply = async () => {
    if (!area || saving) return
    setSaving(true)
    try { await onApply(area) } finally { setSaving(false) }
  }

  const btn = { flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 300, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={t('photo_adjust_title')}
        style={{ width: '100%', maxWidth: 440, background: T.modalBg, border: `1px solid ${T.modalBorder}`, borderRadius: 20, overflow: 'hidden' }}
      >
        <div style={{ padding: '18px 20px 14px' }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{t('photo_adjust_title')}</p>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{t('photo_adjust_hint')}</p>
        </div>

        <div style={{ position: 'relative', height: 'min(58vh, 420px)', background: T.cropStageBg }}>
          <Cropper
            image={image}
            crop={crop} zoom={zoom} maxZoom={4}
            aspect={PHOTO_ASPECT}
            initialCroppedAreaPercentages={initialArea ?? undefined}
            onCropChange={setCrop} onZoomChange={setZoom}
            onCropComplete={(percent, pixels) => setArea({ percent, pixels })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 4px', color: T.textMuted }}>
          <ZoomOut className="w-4 h-4" />
          <input
            type="range" min={1} max={4} step={0.01} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            aria-label={t('photo_zoom')}
            style={{ flex: 1, accentColor: T.accentGold }}
          />
          <ZoomIn className="w-4 h-4" />
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '14px 20px 20px' }}>
          <button onClick={onCancel} style={{ ...btn, background: T.stepIdleBg, color: T.text, border: `1px solid ${T.stepIdleBorder}` }}>
            {t('photo_cancel')}
          </button>
          <button onClick={apply} disabled={!area || saving} style={{ ...btn, background: T.stepActiveBg, color: T.stepActiveText, border: `1px solid ${T.stepActiveBorder}`, opacity: area && !saving ? 1 : 0.6 }}>
            {t('photo_apply')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
