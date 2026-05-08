import { useState, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shield, Download, ChevronRight, Heart, Lock, Zap, X } from 'lucide-react'
import PanIndiaTemplate from '../components/PanIndiaTemplate'
import priyaPhoto from '../../Images/AI_Female/Gemini_Generated_Image_y0v7nsy0v7nsy0v7.png'

const PRIYA_DATA = {
  fullName: 'Priya Sharma', dateOfBirth: '1998-03-12', age: '26', gender: 'Female',
  height: "5'4\"", weight: '55 kg', bloodGroup: 'B+',
  religion: 'Hindu', caste: 'Brahmin', subCaste: 'Iyer', motherTongue: 'Telugu',
  education: 'B.Tech (Computer Science)', college: 'JNTU Hyderabad',
  occupation: 'Software Engineer', company: 'Infosys', income: '8 LPA', workLocation: 'Bengaluru',
  fatherName: 'Ramesh Sharma', fatherOccupation: 'Retired Government Officer',
  motherName: 'Sunita Sharma', motherOccupation: 'Homemaker',
  brothers: '1 Elder Brother (Married)', sisters: 'None',
  familyType: 'Nuclear', familyStatus: 'Middle Class', nativePlace: 'Tirupati, Andhra Pradesh',
  hobbies: 'Classical Dance, Reading, Cooking', about: 'Family-oriented, calm & composed, loves to travel',
  rashi: 'Vrishabha', nakshatra: 'Rohini', gotra: 'Kashyapa', manglik: 'No',
  address: '12, MG Road, Koramangala', city: 'Bengaluru', state: 'Karnataka',
  phone: '+91 90000 00000', email: 'priya.sharma@email.com',
  photo: priyaPhoto, photoPosition: { x: 50, y: 20 }, sloganLanguage: 'hide', customFields: [],
}

/* Renders PanIndiaTemplate scaled to exactly containerW wide.
   Pass template to override which theme is shown (defaults to PRIYA_DATA's template).
   When visibleH is set, clips to that height. When omitted, auto-measures full height. */
function LivePreview({ containerW, visibleH, shadow = true, template }) {
  const naturalW = 760
  const scale = containerW / naturalW
  const innerRef = useRef(null)
  const [naturalH, setNaturalH] = useState(0)
  const previewData = template ? { ...PRIYA_DATA, template } : PRIYA_DATA

  useLayoutEffect(() => {
    if (innerRef.current) setNaturalH(innerRef.current.scrollHeight)
  }, [containerW, template])

  const outerH = visibleH ?? (naturalH ? naturalH * scale : 'auto')

  return (
    <div style={{
      width: containerW,
      height: outerH,
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: shadow ? '0 24px 60px rgba(201,160,53,0.2), 0 8px 24px rgba(0,0,0,0.3)' : 'none',
    }}>
      <div ref={innerRef} style={{ width: naturalW, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <PanIndiaTemplate data={previewData} />
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}


/* ── Template catalogue ── */
const STYLES = [
  { id: 'panIndia',   live: true,  name: 'Lotus',     symbol: '✦', gradient: 'linear-gradient(135deg, #6B0F1A, #C9A035)', desc: 'Gold & maroon · Timeless classic'       },
  { id: 'artDeco',    live: true,  name: 'Art Deco',   symbol: '◇', gradient: 'linear-gradient(135deg, #1B2A4A, #BFA060)', desc: 'Navy & gold · Geometric precision'      },
  { id: 'floralVine', live: true,  name: 'Floral',     symbol: '✿', gradient: 'linear-gradient(135deg, #2A4A1C, #C8A020)', desc: 'Forest green · Botanical charm'         },
  { id: 'peacock',    live: true,  name: 'Peacock',    symbol: '☯', gradient: 'linear-gradient(135deg, #0D4A5E, #F0B840)', desc: 'Teal & bright gold · Royal elegance'   },
  { id: 'mandala',    live: true,  name: 'Mandala',    symbol: '◉', gradient: 'linear-gradient(135deg, #7A1A10, #E07830)', desc: 'Rust & orange · Festive warmth'         },
  { id: 'celestial',  live: true,  name: 'Celestial',  symbol: '★', gradient: 'linear-gradient(135deg, #1E0850, #A888E0)', desc: 'Indigo & lavender · Mystical beauty'   },
  { id: 'bridal',     live: true,  name: 'Bridal',     symbol: '❋', gradient: 'linear-gradient(135deg, #720A20, #D4BC90)', desc: 'Crimson & pearl · Ornate opulence'     },
  { id: 'minimal',    live: false, name: 'Minimal',    symbol: '○', gradient: 'linear-gradient(135deg, #374151, #6b7280)', desc: 'No borders · Clean typography'         },
  { id: 'royal',      live: false, name: 'Royal',      symbol: '♛', gradient: 'linear-gradient(135deg, #1e1b4b, #4338ca)', desc: 'Deep navy · Gold filigree'             },
  { id: 'modern',     live: false, name: 'Modern',     symbol: '◈', gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)', desc: 'Light palette · Contemporary layout'   },
]

/* Portrait template card — matches PDF aspect ratio */
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
        border: s.live ? '1.5px solid rgba(201,160,53,0.4)' : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: s.live ? '0 10px 32px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'box-shadow 0.2s',
      }}>
        {s.live ? (
          <LivePreview containerW={160} visibleH={224} shadow={false} template={s.id} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: s.gradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.6 }}>
            <span style={{ fontSize: 36 }}>{s.symbol}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
      </div>
      <div style={{ padding: '10px 2px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.name}</span>
        {s.live
          ? <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: 20 }}>Live</span>
          : <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', padding: '2px 7px' }}>Soon</span>
        }
      </div>
    </motion.div>
  )
}

/* Group templates: live collection vs coming soon */
const STYLE_GROUPS = [
  { label: 'Classic Collection', sub: '7 designs · Available now', ids: ['panIndia', 'artDeco', 'floralVine', 'peacock', 'mandala', 'celestial', 'bridal'] },
  { label: 'Coming Soon',        sub: 'More styles in the works',   ids: ['minimal', 'royal', 'modern'] },
]

/* Full-screen modal */
function TemplateModal({ s, onClose, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f0f1a', borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '100%', maxWidth: 880, maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{s.symbol}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'serif' }}>{s.name}</span>
            {s.live && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.08em' }}>Available now</span>}
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        {s.live ? (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 28px 32px', gap: 24, background: 'rgba(201,160,53,0.03)' }}>
            <LivePreview containerW={400} shadow={false} template={s.id} />
            <button onClick={() => onStart(s.id)} className="btn-primary" style={{ padding: '14px 40px', fontSize: 15 }}>
              Create with this style <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>{s.symbol}</div>
            <h3 style={{ fontFamily: 'serif', fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 10 }}>{s.name} is on the way</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 340, lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '6px 16px', borderRadius: 20 }}>In the works — coming soon</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function TemplatesSection({ onStart }) {
  const [selected, setSelected] = useState(null)

  return (
    <section id="templates" className="bg-[#0a0a12] py-28">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 px-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Templates</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-5">
            Your story,<br />your style.
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-lg leading-relaxed">
            Every design is a print-ready PDF. Click any card to preview in full.
          </p>
        </motion.div>

        {STYLE_GROUPS.map((group, gi) => {
          const groupStyles = STYLES.filter(s => group.ids.includes(s.id))
          return (
            <motion.div key={group.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="mb-10">
              <div className="px-8 mb-5 flex items-baseline gap-3">
                <span className="text-sm font-bold text-white/80 tracking-wide">{group.label}</span>
                <span className="text-xs text-white/30">{group.sub}</span>
              </div>
              <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                className="[&::-webkit-scrollbar]:hidden">
                <div style={{ display: 'flex', gap: 14, padding: '4px 32px 16px' }}>
                  {groupStyles.map((s, i) => (
                    <StyleCard key={s.id} s={s} i={i} onClick={() => setSelected(s)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}

      </div>

      <AnimatePresence>
        {selected && <TemplateModal s={selected} onClose={() => setSelected(null)} onStart={onStart} />}
      </AnimatePresence>
    </section>
  )
}

const FEATURES = [
  { icon: Lock, label: 'Stays on your device', desc: 'Nothing is uploaded. Your details, photo, and biodata exist only in your browser.' },
  { icon: Zap, label: 'Ready in minutes', desc: 'Fill your details, preview instantly, download a print-ready PDF. No friction.' },
  { icon: Sparkles, label: 'Every tradition', desc: 'Templates crafted for Hindu, Muslim, Sikh, Christian, and Jain families — more added regularly.' },
  { icon: Download, label: 'Share anywhere', desc: 'PDF works on every device. Share on WhatsApp, email, or print — exactly as designed.' },
]

export default function LandingPage({ onStart, onContinue, savedName }) {
  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="hero-gradient relative min-h-screen flex flex-col overflow-hidden">
        <div className="orb w-[500px] h-[500px] top-[-15%] left-[-12%] bg-purple-600/20" />
        <div className="orb w-96 h-96 top-[15%] right-[-10%] bg-pink-500/20" />
        <div className="orb w-72 h-72 bottom-[5%] left-[35%] bg-amber-500/15" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <span className="font-serif text-xl font-semibold text-white">Bandhan</span>
          </motion.div>
          <div className="flex items-center gap-3">
            {savedName && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                onClick={onContinue} className="btn-ghost text-sm">
                Continue — {savedName}
              </motion.button>
            )}
            <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              onClick={onStart} className="btn-primary text-sm">
              {savedName ? 'Start Fresh' : 'Begin Free'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </nav>

        {/* Hero body */}
        <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-8 py-16 gap-16">
          <div className="flex-1 max-w-lg">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 mb-8">
              <Sparkles className="w-4 h-4" /> Free · No sign-up · Private by design
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
              className="font-serif text-5xl lg:text-6xl font-bold leading-[1.08] text-white mb-6">
              Your story,<br />
              <span className="gradient-text italic">beautifully told.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
              className="text-lg text-white/55 leading-relaxed mb-10">
              Create a marriage biodata that honours your family, your culture, and your tradition —
              in the time it takes to have a cup of tea.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-wrap gap-4">
              {savedName ? (
                <>
                  <button onClick={onContinue} className="btn-primary text-base px-8 py-4">
                    Continue Biodata <ChevronRight className="w-5 h-5" />
                  </button>
                  <button onClick={onStart} className="btn-ghost text-base px-8 py-4">Start Fresh</button>
                </>
              ) : (
                <>
                  <button onClick={onStart} className="btn-primary text-base px-8 py-4">
                    Create Your Biodata <ChevronRight className="w-5 h-5" />
                  </button>
                  <a href="#templates" className="btn-ghost text-base px-8 py-4">Explore Templates</a>
                </>
              )}
            </motion.div>

            {savedName && (
              <motion.p custom={3.5} variants={fadeUp} initial="hidden" animate="show"
                className="mt-5 text-sm text-green-400/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Progress saved for <span className="font-semibold">{savedName}</span> — pick up where you left off
              </motion.p>
            )}

            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="flex items-center gap-6 mt-10 text-sm text-white/35">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-400" /> 100% Private</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-blue-400" /> Instant PDF</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> Forever free</span>
            </motion.div>
          </div>

          {/* Floating portrait template previews — 5 cards, staggered depth */}
          <div className="flex-1 hidden lg:flex items-center justify-center relative h-[540px] overflow-visible">

            {/* Ambient glow pool */}
            <div className="absolute pointer-events-none" style={{ width: 480, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse at center, rgba(168,136,224,0.1) 0%, transparent 70%)', filter: 'blur(8px)' }} />

            {[
              { template: 'panIndia',   x: -234, scl: 0.80, op: 0.50, rot: -6,  y: [0,   -10, 0],   delay: 0,   z: 1, glow: 'rgba(201,160,53,0.5)'  },
              { template: 'floralVine', x: -118, scl: 0.91, op: 0.75, rot: -2,  y: [-6,  -18, -6],  delay: 0.5, z: 2, glow: 'rgba(200,160,32,0.5)'  },
              { template: 'peacock',    x: 0,    scl: 1.06, op: 1,    rot: 0,   y: [-14, -28, -14], delay: 1.0, z: 5, glow: 'rgba(240,184,64,0.6)'  },
              { template: 'mandala',    x: 118,  scl: 0.91, op: 0.75, rot: 2,   y: [-4,  -16, -4],  delay: 0.7, z: 2, glow: 'rgba(224,120,48,0.5)'  },
              { template: 'celestial',  x: 234,  scl: 0.80, op: 0.50, rot: 6,   y: [-2,  -12, -2],  delay: 1.4, z: 1, glow: 'rgba(168,136,224,0.5)' },
            ].map(({ template, x, scl, op, rot, y, delay, z, glow }) => (
              <motion.div key={template}
                style={{ position: 'absolute', x, scale: scl, opacity: op, rotate: rot, zIndex: z }}
                animate={{ y }}
                transition={{ duration: 8 + z * 0.4, repeat: Infinity, ease: 'easeInOut', delay }}
              >
                {/* Per-card coloured glow pool */}
                <div style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', width: 100, height: 44, background: glow, filter: 'blur(22px)', borderRadius: '50%', zIndex: -1 }} />

                <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: z === 5 ? '0 32px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)' : '0 12px 36px rgba(0,0,0,0.35)' }}>
                  <LivePreview containerW={130} visibleH={182} shadow={false} template={template} />
                </div>
              </motion.div>
            ))}

            {/* Twinkling sparkle dots */}
            {[
              { x: -195, y: -105, s: 5, d: 0    },
              { x:   85, y: -130, s: 3, d: 1.2  },
              { x: -55,  y:  95,  s: 4, d: 0.6  },
              { x:  210, y:  -55, s: 5, d: 1.8  },
              { x: -240, y:   50, s: 3, d: 0.3  },
              { x:  155, y:  110, s: 4, d: 2.2  },
              { x:   30, y: -160, s: 3, d: 0.9  },
            ].map((sp, i) => (
              <motion.div key={i} style={{ position: 'absolute', x: sp.x, y: sp.y, zIndex: 10 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: sp.d, repeatDelay: 1.5 }}>
                <svg width={sp.s} height={sp.s} viewBox="0 0 10 10">
                  <circle cx="5" cy="5" r="4" fill="rgba(255,255,255,0.85)" />
                </svg>
              </motion.div>
            ))}

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0a0a12] to-transparent" />
      </section>

      {/* ── TEMPLATES ── */}
      <TemplatesSection onStart={onStart} />

      {/* ── FEATURES ── */}
      <section className="bg-[#080810] py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Designed with intention</p>
            <h2 className="font-serif text-4xl font-bold text-white">Nothing unnecessary.<br />Everything that matters.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 flex gap-5 group hover:border-purple-500/25 transition-colors duration-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-1.5">{label}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#0a0a12] py-28 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-4">How it works</p>
            <h2 className="font-serif text-4xl font-bold text-white">Three steps.<br />One beautiful biodata.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            {[
              { num: '01', title: 'Fill your details', desc: 'Personal, family, career, horoscope, contact — guided step by step.' },
              { num: '02', title: 'Choose your template', desc: 'Select the design that matches your culture and tradition.' },
              { num: '03', title: 'Download and share', desc: 'Your PDF is ready instantly. Share on WhatsApp or print.' },
            ].map(({ num, title, desc }, i) => (
              <motion.div key={num}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 relative z-10">
                  <span className="font-serif text-2xl font-bold text-white">{num}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#080810] py-28 px-8">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-4">Good to know</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-5">Questions families ask</h2>
            <p className="text-white/40 leading-relaxed">
              A biodata is one of the most personal documents a family shares.
              We built Bandhan to make sure creating one feels simple, private, and right.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-3">
            {[
              ['Is this really free?', 'Yes — completely. No sign-up, no payment, no hidden steps. The full biodata builder is free.'],
              ['Does my data leave my device?', 'Never. Everything stays in your browser. We have no servers, no database, no accounts.'],
              ['Can I save and come back later?', 'Yes. Bandhan auto-saves your progress in your browser. Return any time and continue exactly where you left off.'],
              ['What details should I include?', 'Name, date of birth, height, religion, education, profession, family background, horoscope, photo, and contact. Bandhan has a dedicated section for each.'],
              ['Can I edit after previewing?', 'Yes. Use the quick-jump bar to go directly to any field, edit, and return to preview instantly.'],
              ['How do I share on WhatsApp?', 'Download the PDF, then tap the Share on WhatsApp button that appears. The file attaches directly in the chat.'],
            ].map(([q, a]) => (
              <div key={q} className="border border-white/8 bg-white/[0.03] p-5 rounded-xl">
                <h3 className="text-white font-semibold text-sm mb-2">{q}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero-gradient py-32 px-8 relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] top-[-40%] left-[15%] bg-purple-600/25" />
        <div className="orb w-72 h-72 bottom-[-20%] right-[8%] bg-pink-500/20" />
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Begin your<br />
            <span className="gradient-text italic">Bandhan today.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            Free, private, and ready in minutes.<br />The biodata your family deserves.
          </p>
          <button onClick={onStart} className="btn-primary text-lg px-14 py-5">
            Create Your Biodata <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080810] py-8 px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="font-serif text-white/80">Bandhan</span>
            <span className="text-white/30 text-sm ml-1">· bandhan.app</span>
          </div>
          <p className="text-white/25 text-sm">Your data never leaves your browser · 100% Private · Free forever</p>
        </div>
      </footer>
    </div>
  )
}
