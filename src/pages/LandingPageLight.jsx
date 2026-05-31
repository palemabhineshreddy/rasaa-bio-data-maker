import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shield, Download, ChevronRight, ChevronLeft, Heart, Lock, Zap, X, Globe, Moon } from 'lucide-react'
import BioTemplate from '../components/BioTemplate'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import LivePreview, { SAMPLE_BY_TEMPLATE } from '../components/LivePreview'


const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}

const STYLES = [
  { id: 'lotus',      live: true,  name: 'Lotus',     symbol: '✦', gradient: 'linear-gradient(135deg, #6B0F1A, #C9A035)', desc: 'Gold & maroon · Timeless classic'       },
  { id: 'artDeco',    live: true,  name: 'Art Deco',   symbol: '◇', gradient: 'linear-gradient(135deg, #1B2A4A, #BFA060)', desc: 'Navy & gold · Geometric precision'      },
  { id: 'floralVine', live: true,  name: 'Floral',     symbol: '✿', gradient: 'linear-gradient(135deg, #2A4A1C, #C8A020)', desc: 'Forest green · Botanical charm'         },
  { id: 'peacock',    live: true,  name: 'Peacock',    symbol: '☯', gradient: 'linear-gradient(135deg, #0D4A5E, #F0B840)', desc: 'Teal & bright gold · Royal elegance'   },
  { id: 'mandala',    live: true,  name: 'Mandala',    symbol: '◉', gradient: 'linear-gradient(135deg, #7A1A10, #E07830)', desc: 'Rust & orange · Festive warmth'         },
  { id: 'celestial',  live: true,  name: 'Celestial',  symbol: '★', gradient: 'linear-gradient(135deg, #1E0850, #A888E0)', desc: 'Indigo & lavender · Mystical beauty'   },
  { id: 'bridal',     live: true,  name: 'Bridal',     symbol: '❋', gradient: 'linear-gradient(135deg, #720A20, #D4BC90)', desc: 'Crimson & pearl · Ornate opulence'     },
  { id: 'minimal',    live: true,  name: 'Minimal',    symbol: '○', gradient: 'linear-gradient(135deg, #4A4540, #9B8B7A)', desc: 'Warm slate · Understated elegance'      },
  { id: 'royal',      live: true,  name: 'Royal',      symbol: '♛', gradient: 'linear-gradient(135deg, #1A0A3A, #D4A820)', desc: 'Deep indigo · Jewelled frame · Grand'   },
  { id: 'modern',     live: true,  name: 'Modern',     symbol: '◈', gradient: 'linear-gradient(135deg, #0D3D30, #00B894)', desc: 'Teal & cyan · Bold contemporary feel'   },
  { id: 'amethyst',   live: true,  name: 'Amethyst',   symbol: '◆', gradient: 'linear-gradient(135deg, #4A0A78, #C070E8)', desc: 'Deep violet · Diamond lattice · Rich'  },
  { id: 'ember',      live: true,  name: 'Ember',      symbol: '◐', gradient: 'linear-gradient(135deg, #7A2C08, #F07030)', desc: 'Burnt sienna · Arc fan · Vibrant'      },
  { id: 'rose',       live: true,  name: 'Rose',       symbol: '❀', gradient: 'linear-gradient(135deg, #7A1040, #E898A0)', desc: 'Deep rose · Petal corners · Romantic'  },
  { id: 'midnight',   live: true,  name: 'Midnight',   symbol: '⊡', gradient: 'linear-gradient(135deg, #080818, #4880E0)', desc: 'Near-black · Circuit corners · Modern' },
  { id: 'noir',       live: true,  name: 'Noir',       symbol: '◾', gradient: 'linear-gradient(135deg, #0c0c0c, #e8a820)', desc: 'Jet black · Amber accents · Dark luxury'      },
  { id: 'aurora',     live: true,  name: 'Aurora',     symbol: '✦', gradient: 'linear-gradient(135deg, #1a0040, #002840)', desc: 'Deep gradient · Glowing cyan · Cosmic feel'    },
  { id: 'editorial',  live: true,  name: 'Editorial',  symbol: '▮', gradient: 'linear-gradient(135deg, #0f172a, #e5193c)', desc: 'Navy & red · Magazine bold · High contrast'    },
  { id: 'bloom',      live: true,  name: 'Bloom',      symbol: '◉', gradient: 'linear-gradient(135deg, #fdf6ef, #c084fc)', desc: 'Warm cream · Rose accent bar · Soft aesthetic' },
  { id: 'neo',        live: true,  name: 'Neo',        symbol: '◼', gradient: 'linear-gradient(135deg, #ffe033, #f5f4f0)', desc: 'Yellow header · Bold type · Neo-brutalist'     },
]

/* ── StyleCard ── */
function StyleCard({ s, i, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.06 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ width: 160, flexShrink: 0, cursor: 'pointer' }}
    >
      <div style={{
        height: 224, borderRadius: 16, overflow: 'hidden', position: 'relative',
        border: '1.5px solid #e5e7eb',
        boxShadow: s.live ? '0 8px 32px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.25s',
      }}>
        {s.live ? (
          <LivePreview containerW={160} visibleH={224} shadow={false} template={s.id} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: s.gradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.7 }}>
            <span style={{ fontSize: 36 }}>{s.symbol}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{s.name}</span>
        {s.live
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', padding: '2px 7px', borderRadius: 20 }}>Live</span>
          : <span style={{ fontSize: 9, fontWeight: 600, color: '#9ca3af', padding: '2px 7px' }}>Soon</span>
        }
      </div>
    </motion.div>
  )
}

/* ── TemplateRow (dark theme) ── */
function TemplateRow({ groupStyles, onSelect }) {
  const scrollRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const CARD_STEP = 174

  const scrollTo = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (dir > 0) {
      el.scrollLeft >= max - 8
        ? (el.scrollLeft = 0)
        : el.scrollBy({ left: CARD_STEP * 2, behavior: 'smooth' })
    } else {
      el.scrollLeft <= 8
        ? (el.scrollLeft = max)
        : el.scrollBy({ left: -CARD_STEP * 2, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const max = el.scrollWidth - el.clientWidth
      el.scrollLeft >= max - 8
        ? (el.scrollLeft = 0)
        : el.scrollBy({ left: CARD_STEP, behavior: 'smooth' })
    }, 4000)
    return () => clearInterval(id)
  }, [paused, groupStyles])

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
  }, [groupStyles])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [groupStyles])

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 2500)}>

      <AnimatePresence>
        {canLeft && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 16, width: 72, zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 4,
              background: 'linear-gradient(to right, #ffffff 35%, transparent)' }}>
            <motion.button onClick={() => scrollTo(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#9ca3af', display: 'flex' }}
              whileHover={{ scale: 1.3, color: '#0a0a0a' }} whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }}>
              <ChevronLeft size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="[&::-webkit-scrollbar]:hidden">
        <div style={{ display: 'flex', gap: 14, padding: '4px 24px 16px' }}>
          {groupStyles.map((s, i) => (
            <StyleCard key={s.id} s={s} i={i} onClick={() => onSelect(s)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {canRight && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 16, width: 72, zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4,
              background: 'linear-gradient(to left, #ffffff 35%, transparent)' }}>
            <motion.button onClick={() => scrollTo(1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#9ca3af', display: 'flex' }}
              whileHover={{ scale: 1.3, color: '#0a0a0a' }} whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }}>
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const STYLE_GROUP_IDS = [
  { labelKey: 'tpl_group1', subKey: 'tpl_group1_sub', ids: ['lotus', 'artDeco', 'floralVine', 'peacock', 'mandala', 'celestial', 'bridal'] },
  { labelKey: 'tpl_group2', subKey: 'tpl_group2_sub', ids: ['minimal', 'royal', 'modern', 'amethyst', 'ember', 'rose', 'midnight'] },
  { labelKey: 'tpl_group3', subKey: 'tpl_group3_sub', ids: ['noir', 'aurora', 'editorial', 'bloom', 'neo'] },
]

/* ── TemplateModal (keep dark — modals look great with contrast) ── */
function TemplateModal({ s, onClose, onStart }) {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(s)
  const initialGroupIdx = STYLE_GROUP_IDS.findIndex(g => g.ids.includes(s.id))
  const [activeGroup, setActiveGroup] = useState(initialGroupIdx === -1 ? 0 : initialGroupIdx)
  const stripRef = useRef(null)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 480
  const isMobile = vw < 640
  const outerPad = isMobile ? 16 : 24
  const bodyPadH = isMobile ? 16 : 28
  const previewW = Math.min(400, vw - outerPad * 2 - bodyPadH * 2)

  const groupStyles = STYLE_GROUP_IDS[activeGroup].ids
    .map(id => STYLES.find(st => st.id === id))
    .filter(st => st && st.live)

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

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: outerPad }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#ffffff', borderRadius: isMobile ? 20 : 24, overflow: 'hidden',
          border: '1px solid #e5e7eb', width: '100%', maxWidth: 880, maxHeight: '90vh',
          display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '12px 16px' : '16px 28px',
          borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: isMobile ? 18 : 22, flexShrink: 0 }}>{current.symbol}</span>
            <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#0a0a0a', fontFamily: "'Playfair Display', Georgia, serif",
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.name}</span>
            {current.live && <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,0.08)',
              border: '1px solid rgba(22,163,74,0.2)', padding: '3px 8px', borderRadius: 20, letterSpacing: '0.08em', flexShrink: 0 }}>
              {t('tpl_available')}
            </span>}
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e5e7eb',
            background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af', flexShrink: 0, marginLeft: 12 }}>
            <X size={15} />
          </button>
        </div>

        {/* Preview — scrollable */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: isMobile ? `16px ${bodyPadH}px 12px` : '24px 28px 16px',
          background: '#fafafa' }}>
          <AnimatePresence mode="wait">
            <motion.div key={current.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}>
              <LivePreview containerW={previewW} shadow={false} template={current.id} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail strip — group tabs + templates */}
        <div style={{ flexShrink: 0, borderTop: '1px solid #f3f4f6', background: '#f9fafb' }}>
          {/* Group tabs */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 8px',
            overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="[&::-webkit-scrollbar]:hidden">
            {STYLE_GROUP_IDS.map((group, gi) => (
              <button key={group.labelKey} onClick={() => setActiveGroup(gi)} style={{
                padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                background: activeGroup === gi ? '#0a0a0a' : '#ffffff',
                color: activeGroup === gi ? '#ffffff' : '#6b7280',
                border: activeGroup === gi ? '1px solid #0a0a0a' : '1px solid #e5e7eb',
                transition: 'all 0.18s',
              }}>
                {t(group.labelKey)}
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
                style={{ flexShrink: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4 }}>
                <div style={{ borderRadius: 8, overflow: 'hidden',
                  border: `2px solid ${current.id === st.id ? '#0a0a0a' : '#e5e7eb'}`,
                  boxShadow: current.id === st.id ? '0 0 0 3px rgba(10,10,10,0.08)' : 'none',
                  transition: 'border-color 0.18s, box-shadow 0.18s' }}>
                  <LivePreview containerW={64} visibleH={90} shadow={false} template={st.id} />
                </div>
                <span style={{ fontSize: 10, fontWeight: current.id === st.id ? 700 : 400,
                  color: current.id === st.id ? '#0a0a0a' : '#9ca3af',
                  whiteSpace: 'nowrap', transition: 'color 0.18s' }}>
                  {st.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ flexShrink: 0, padding: isMobile ? '12px 16px 18px' : '14px 28px 20px',
          borderTop: '1px solid #f3f4f6', background: '#ffffff',
          display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => onStart(current.id)} className="btn-amber"
            style={{ padding: isMobile ? '11px 28px' : '13px 40px', fontSize: 15,
              width: '100%', maxWidth: 340, justifyContent: 'center' }}>
            {t('tpl_modal_btn')} <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── TemplatesSection ── */
function TemplatesSection({ onStart }) {
  const [selected, setSelected] = useState(null)
  const [activeGroup, setActiveGroup] = useState(0)
  const { t } = useLanguage()

  const currentGroup = STYLE_GROUP_IDS[activeGroup]
  const groupStyles = STYLES.filter(s => currentGroup.ids.includes(s.id))

  return (
    <section id="templates" style={{ background: '#f9fafb', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#6b7280', marginBottom: 16 }}>{t('tpl_label')}</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
            lineHeight: 1.2, color: '#0a0a0a', marginBottom: 16 }}>
            {t('tpl_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <p style={{ color: '#6b7280', maxWidth: 480, margin: '0 auto', fontSize: 16, lineHeight: 1.7 }}>
            {t('tpl_desc')}
          </p>
        </motion.div>

        {/* Group tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 16 }}>
          <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="[&::-webkit-scrollbar]:hidden">
            <div style={{ display: 'flex', gap: 8, padding: '0 24px 4px', flexWrap: 'nowrap' }}>
              {STYLE_GROUP_IDS.map((group, gi) => (
                <button key={group.labelKey} onClick={() => setActiveGroup(gi)} style={{
                  padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  background: activeGroup === gi ? '#0a0a0a' : '#ffffff',
                  color: activeGroup === gi ? '#ffffff' : '#6b7280',
                  border: `1px solid ${activeGroup === gi ? '#0a0a0a' : '#e5e7eb'}`,
                  transition: 'all 0.2s',
                }}>
                  {t(group.labelKey)}
                  <span style={{ marginLeft: 7, fontSize: 11, opacity: 0.6,
                    background: activeGroup === gi ? 'rgba(255,255,255,0.15)' : '#f3f4f6',
                    padding: '1px 6px', borderRadius: 10 }}>
                    {group.ids.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ padding: '0 24px', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{t(currentGroup.subKey)}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeGroup}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
            <TemplateRow groupStyles={groupStyles} onSelect={setSelected} />
          </motion.div>
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {selected && <TemplateModal s={selected} onClose={() => setSelected(null)} onStart={onStart} />}
      </AnimatePresence>
    </section>
  )
}

const FEATURE_ICONS = [
  { icon: Lock,     labelKey: 'feat1_label', descKey: 'feat1_desc' },
  { icon: Zap,      labelKey: 'feat2_label', descKey: 'feat2_desc' },
  { icon: Sparkles, labelKey: 'feat3_label', descKey: 'feat3_desc' },
  { icon: Download, labelKey: 'feat4_label', descKey: 'feat4_desc' },
  { icon: Heart,    labelKey: 'feat5_label', descKey: 'feat5_desc' },
  { icon: Globe,    labelKey: 'feat6_label', descKey: 'feat6_desc' },
]

/* ── Main landing page ── */
export default function LandingPageLight({ onStart, onContinue, savedName, setTheme }) {
  const { t, lang } = useLanguage()
  const [openFaq, setOpenFaq] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const HOW_STEPS = [
    { num: '01', titleKey: 'how_s1_title', descKey: 'how_s1_desc' },
    { num: '02', titleKey: 'how_s2_title', descKey: 'how_s2_desc' },
    { num: '03', titleKey: 'how_s3_title', descKey: 'how_s3_desc' },
  ]
  const FAQ_KEYS = [
    ['faq_q1','faq_a1'], ['faq_q2','faq_a2'], ['faq_q3','faq_a3'],
    ['faq_q4','faq_a4'], ['faq_q5','faq_a5'],
  ]

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0a0a0a' }}>

      {/* ── STICKY NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#ffffff',
        borderBottom: scrolled ? '1px solid #f3f4f6' : '1px solid transparent',
        transition: 'border-color 0.2s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default', flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6,
              background: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart style={{ width: 14, height: 14, color: '#ffffff', fill: '#ffffff' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Bandhan</span>
          </motion.div>

          {/* Nav links – desktop only */}
          <nav className="hidden md:flex" style={{ gap: 32 }}>
            {[['#templates','Templates'],['#how','How it Works'],['#features','Features']].map(([href, label]) => (
              <a key={href} href={href}
                style={{ fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', color: '#6b7280' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b7280' }}>
                {label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <LanguageSwitcher compact />
            <button onClick={() => setTheme('dark')} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 100,
              background: 'transparent', border: '1px solid #e5e7eb',
              color: '#6b7280', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280' }}>
              <Moon size={13} /> Dark
            </button>
            {savedName ? (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }} onClick={onContinue} className="btn-amber"
                style={{ padding: '8px 18px', fontSize: 13, maxWidth: 220 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t('continue_btn')} — {savedName}
                </span>
                <ChevronRight style={{ width: 14, height: 14, flexShrink: 0 }} />
              </motion.button>
            ) : (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }} onClick={onStart} className="btn-amber"
                style={{ padding: '8px 18px', fontSize: 13 }}>
                {t('begin_free')} <ChevronRight style={{ width: 14, height: 14 }} />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        background: '#ffffff',
        minHeight: '92vh', position: 'relative', overflowX: 'clip',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Subtle grid */}
          <div style={{ position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', width: '100%',
          display: 'flex', alignItems: 'center', gap: 48, position: 'relative', zIndex: 1 }}>

          {/* Left column */}
          <div style={{ flex: 1, maxWidth: 600 }}>

            {/* Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                borderRadius: 100, background: '#f3f4f6', border: '1px solid #e5e7eb',
                marginBottom: 32 }}>
              <Sparkles style={{ width: 13, height: 13, color: '#6b7280' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', letterSpacing: '0.04em' }}>{t('badge')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
              style={{ fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(42px, 6vw, 78px)',
                fontWeight: 700, lineHeight: 1.07, color: '#0a0a0a', marginBottom: 28,
                letterSpacing: '-0.02em' }}>
              {t('headline1')}<br />
              <span style={{
                background: 'linear-gradient(90deg, #C8960C 0%, #F5D060 40%, #E8B020 70%, #C8960C 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontStyle: lang === 'en' ? 'italic' : 'normal',
                animation: 'shimmer 5s linear infinite',
              }}>
                {t('headline2')}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
              style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.78, marginBottom: 40, maxWidth: 500 }}>
              {t('tagline')}
            </motion.p>

            {/* CTAs */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
              {savedName ? (
                <>
                  <button onClick={onContinue} className="btn-amber" style={{ fontSize: 16, padding: '14px 30px' }}>
                    {t('cta_continue')} <ChevronRight style={{ width: 17, height: 17 }} />
                  </button>
                  <button onClick={onStart} className="btn-ghost" style={{ fontSize: 16, padding: '14px 30px' }}>
                    {t('cta_fresh')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onStart} className="btn-amber" style={{ fontSize: 16, padding: '14px 30px' }}>
                    {t('cta_create')} <ChevronRight style={{ width: 17, height: 17 }} />
                  </button>
                  <a href="#templates" className="btn-ghost" style={{ fontSize: 16, padding: '14px 30px', textDecoration: 'none' }}>
                    {t('cta_explore')}
                  </a>
                </>
              )}
            </motion.div>

            {savedName && (
              <motion.p custom={3.5} variants={fadeUp} initial="hidden" animate="show"
                style={{ fontSize: 14, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                {t('progress_saved')} <strong>{savedName}</strong> {t('pick_up')}
              </motion.p>
            )}

            {/* Trust pills */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 13, color: '#9ca3af', marginBottom: 32 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Shield style={{ width: 14, height: 14, color: '#16a34a' }} /> {t('pill_private')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Download style={{ width: 14, height: 14, color: '#3b82f6' }} /> {t('pill_pdf')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Heart style={{ width: 14, height: 14, color: '#ec4899', fill: '#ec4899' }} /> {t('pill_free')}
              </span>
            </motion.div>

            {/* Social proof */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show"
              style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#9ca3af' }}>
              <div style={{ display: 'flex' }}>
                {['#a78bfa','#f472b6','#fb923c','#34d399'].map((c, i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c,
                    border: '2.5px solid #ffffff', fontSize: 11, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontWeight: 700, marginLeft: i === 0 ? 0 : -11 }}>
                    {['P','R','D','A'][i]}
                  </div>
                ))}
              </div>
              <span>Trusted by <strong style={{ color: '#374151', fontWeight: 700 }}>12,000+</strong> families across India</span>
            </motion.div>
          </div>

          {/* All templates marquee — md+ */}
          <div className="flex-1 hidden md:flex items-center justify-center" style={{ overflow: 'hidden', padding: '0 8px' }}>
            <div style={{ width: '100%', overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}>
              {/* Row 1 — scrolls left */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, width: 'max-content',
                animation: 'marqueeLeft 36s linear infinite' }}>
                {[...STYLES, ...STYLES].map((s, i) => (
                  <div key={i}
                    onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ flexShrink: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <LivePreview containerW={84} visibleH={118} shadow={false} template={s.id} />
                  </div>
                ))}
              </div>
              {/* Row 2 — scrolls right */}
              <div style={{ display: 'flex', gap: 12, width: 'max-content',
                animation: 'marqueeRight 44s linear infinite' }}>
                {[...STYLES, ...STYLES].map((s, i) => (
                  <div key={i}
                    onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ flexShrink: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <LivePreview containerW={84} visibleH={118} shadow={false} template={s.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ background: '#f9fafb', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '52px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 0 }}>
          {[
            { value: '19',      label: 'Unique Templates' },
            { value: '12,000+', label: 'Families Trusted'  },
            { value: '100%',    label: 'Private & Secure'  },
            { value: 'Free',    label: 'PDF Download'      },
          ].map(({ value, label }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: 'center', minWidth: 140, padding: '0 28px',
                borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 700, color: '#0a0a0a',
                lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 10 }}>{value}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, letterSpacing: '0.03em' }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TEMPLATES ── */}
      <TemplatesSection onStart={onStart} />

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: '#ffffff', padding: '108px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 16 }}>{t('how_label')}</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700,
              lineHeight: 1.12, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {t('how_title').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 52, position: 'relative' }}>
            <div className="hidden md:block" style={{ position: 'absolute', top: 44, left: '20%', right: '20%', height: 1,
              background: 'linear-gradient(to right, transparent, #e5e7eb 25%, #e5e7eb 75%, transparent)',
              zIndex: 0 }} />

            {HOW_STEPS.map(({ num, titleKey, descKey }, i) => (
              <motion.div key={num}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.16 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 88, height: 88, borderRadius: 26,
                  background: '#f9fafb', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 32, position: 'relative' }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700,
                    color: '#0a0a0a', letterSpacing: '-0.02em' }}>{num}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0a0a0a', marginBottom: 14, letterSpacing: '-0.01em' }}>{t(titleKey)}</h3>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.78, maxWidth: 220 }}>{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: '#f9fafb', padding: '108px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 68 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 16 }}>{t('feat_label')}</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700,
              lineHeight: 1.12, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {t('feat_title').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
            {FEATURE_ICONS.map(({ icon: Icon, labelKey, descKey }, i) => (
              <motion.div key={labelKey}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ background: '#ffffff', border: '1px solid #f3f4f6',
                  borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 22,
                  cursor: 'default' }}
                whileHover={{ borderColor: '#e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', y: -4 }}
                transition={{ duration: 0.22 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14,
                  background: '#f3f4f6', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 22, height: 22, color: '#374151' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0a0a0a', marginBottom: 10, letterSpacing: '-0.01em' }}>{t(labelKey)}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.78 }}>{t(descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#ffffff', padding: '108px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 68 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 16 }}>Loved by families</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700,
              lineHeight: 1.12, color: '#0a0a0a', letterSpacing: '-0.02em' }}>What families are saying</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Priya S.', location: 'Hyderabad', initials: 'PS', color: '#a78bfa', rating: 5, quote: 'Made my biodata in under 10 minutes. The Lotus design is absolutely beautiful. Shared it on WhatsApp with family immediately!' },
              { name: 'Rahul M.', location: 'Mumbai',    initials: 'RM', color: '#f472b6', rating: 5, quote: 'Best free biodata maker I found. No watermarks, no sign-up needed. Downloaded a clean PDF instantly. Highly recommended.' },
              { name: 'Deepa K.', location: 'Chennai',   initials: 'DK', color: '#fb923c', rating: 5, quote: 'My whole family loved the design. Even my parents were impressed by how professional it looked. Will share with everyone.' },
            ].map(({ name, location, initials, color, rating, quote }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.12 }}
                style={{ background: '#ffffff', border: '1px solid #f3f4f6',
                  borderRadius: 24, padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: 22,
                  position: 'relative', overflow: 'hidden' }}
                whileHover={{ borderColor: '#e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>

                {/* Decorative quote mark */}
                <div style={{ position: 'absolute', top: 14, right: 22, fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 110, color: 'rgba(0,0,0,0.04)', lineHeight: 1, pointerEvents: 'none',
                  fontWeight: 700, userSelect: 'none', zIndex: 0 }}>"</div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, position: 'relative', zIndex: 1 }}>
                  {Array.from({ length: rating }).map((_, j) => (
                    <svg key={j} width="15" height="15" viewBox="0 0 20 20" fill="#F0B820">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, flex: 1, position: 'relative', zIndex: 1 }}>"{quote}"</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16,
                  borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', marginBottom: 3 }}>{name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                      {location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#f9fafb', padding: '108px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', display: 'grid', gap: 64, gridTemplateColumns: '1fr' }}
          className="lg:grid-cols-[1fr_1.3fr]">

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: 80, alignSelf: 'start', background: '#f9fafb', zIndex: 5, paddingBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 16 }}>{t('faq_label')}</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700,
              lineHeight: 1.18, color: '#0a0a0a', marginBottom: 18, letterSpacing: '-0.02em' }}>{t('faq_title')}</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: 15, marginBottom: 36 }}>{t('faq_desc')}</p>
            <button onClick={onStart} className="btn-amber" style={{ padding: '13px 28px', fontSize: 15 }}>
              {t('cta_create')} <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQ_KEYS.map(([qk, ak], idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={qk} style={{
                  border: `1px solid ${isOpen ? '#d1d5db' : '#e5e7eb'}`,
                  background: isOpen ? '#ffffff' : '#ffffff',
                  borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, background 0.2s',
                }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{ width: '100%', padding: '20px 22px', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 14, background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45,
                      color: '#0a0a0a', transition: 'color 0.2s' }}>{t(qk)}</span>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                      style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                        background: isOpen ? '#0a0a0a' : '#f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="6" y1="2" x2="6" y2="10" stroke={isOpen ? '#ffffff' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="2" y1="6" x2="10" y2="6" stroke={isOpen ? '#ffffff' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}>
                        <p style={{ padding: '0 22px 22px', fontSize: 14, color: '#6b7280', lineHeight: 1.8 }}>
                          {t(ak)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: '#0a0a0a', padding: '128px 24px', position: 'relative', overflow: 'hidden' }}>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Start for free</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700,
            lineHeight: 1.08, color: '#ffffff', marginBottom: 26, letterSpacing: '-0.025em' }}>
            {t('cta_title1')}<br />
            <span style={{
              background: 'linear-gradient(90deg, #C8960C 0%, #F5D060 45%, #E8B020 70%, #C8960C 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: lang === 'en' ? 'italic' : 'normal',
            }}>
              {t('cta_title2')}
            </span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 18, lineHeight: 1.8,
            maxWidth: 500, margin: '0 auto 52px' }}>
            {t('cta_subtitle').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <button onClick={onStart} style={{ fontSize: 16, padding: '14px 40px', borderRadius: 100, fontWeight: 600,
              background: '#ffffff', color: '#0a0a0a', border: '1.5px solid #ffffff', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff' }}>
              {t('cta_btn')} <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
            <a href="#templates" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 100, fontWeight: 600,
              background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
              {t('cta_explore')}
            </a>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            No sign-up required · 100% free · Instant PDF download
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a0a0a', padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 24, marginBottom: 32, paddingBottom: 32,
            borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart style={{ width: 13, height: 13, color: '#0a0a0a', fill: '#0a0a0a' }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#ffffff', fontWeight: 700, fontSize: 18 }}>Bandhan</span>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['#templates','Templates'],['#how','How it Works'],['#features','Features']].map(([href, label]) => (
                <a key={href} href={href}
                  style={{ fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s',
                    color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ffffff' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>{t('footer_tagline')}</p>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2026 Bandhan · bandhan.app</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
