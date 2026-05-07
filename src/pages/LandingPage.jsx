import { useState } from 'react'
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
  photo: priyaPhoto, photoPosition: { x: 50, y: 20 }, customFields: [],
}

/* Renders the actual PanIndiaTemplate scaled down — pixel-perfect preview */
function LivePreview({ scale = 0.28, visibleH = 320 }) {
  const naturalW = 760
  return (
    <div style={{ width: Math.round(naturalW * scale), height: visibleH, overflow: 'hidden', borderRadius: 4, boxShadow: '0 32px 80px rgba(201,160,53,0.22), 0 8px 24px rgba(0,0,0,0.35)', flexShrink: 0 }}>
      <div style={{ width: naturalW, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <PanIndiaTemplate data={PRIYA_DATA} />
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


/* ── Template preview cards ── */
const RELIGIONS = [
  {
    id: 'hindu', live: true, name: 'Hindu', symbol: 'ॐ',
    gradient: 'linear-gradient(135deg, #b45309, #C9A035, #92400e)',
    glow: 'rgba(201,160,53,0.5)', size: 148,
    desc: 'Pan-India · All communities · Horoscope ready',
    features: ['Lotus corner ornaments', 'Gold & maroon palette', 'Full horoscope section', 'Photo upload & crop'],
  },
  {
    id: 'muslim', live: false, name: 'Muslim', symbol: '☪',
    gradient: 'linear-gradient(135deg, #14532d, #16a34a)',
    glow: 'rgba(22,163,74,0.35)', size: 116,
    desc: 'Nikah Biodata · Urdu-ready · Green & ivory',
  },
  {
    id: 'sikh', live: false, name: 'Sikh', symbol: '☬',
    gradient: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    glow: 'rgba(37,99,235,0.35)', size: 116,
    desc: 'Punjabi style · Navy & gold · Gurmukhi fields',
  },
  {
    id: 'christian', live: false, name: 'Christian', symbol: '✝',
    gradient: 'linear-gradient(135deg, #312e81, #6366f1)',
    glow: 'rgba(99,102,241,0.35)', size: 116,
    desc: 'Church style · Denomination fields · Ivory & indigo',
  },
  {
    id: 'jain', live: false, name: 'Jain', symbol: '🕉',
    gradient: 'linear-gradient(135deg, #78350f, #d97706)',
    glow: 'rgba(217,119,6,0.35)', size: 116,
    desc: 'Sect-specific fields · Amber & brown · Minimalist',
  },
  {
    id: 'buddhist', live: false, name: 'Buddhist', symbol: '☸',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    glow: 'rgba(124,58,237,0.35)', size: 116,
    desc: 'Dhamma-inspired · Saffron & violet · Clean layout',
  },
]

function ReligionBubble({ r, i, selected, onSelect }) {
  const isSelected = selected?.id === r.id
  return (
    <motion.div
      className="flex flex-col items-center gap-3 cursor-pointer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      animate={{ y: [0, i % 2 === 0 ? -10 : -6, 0] }}
      // @ts-ignore
      transition2={{ y: { duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 } }}
      onClick={() => onSelect(isSelected ? null : r)}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: r.size, height: r.size, borderRadius: '50%',
          background: r.gradient,
          boxShadow: isSelected
            ? `0 0 0 4px white, 0 12px 48px ${r.glow}`
            : `0 8px 32px ${r.glow}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
          position: 'relative', transition: 'box-shadow 0.3s',
          opacity: !r.live && !isSelected ? 0.65 : 1,
        }}
      >
        <span style={{ fontSize: r.size * 0.28, lineHeight: 1 }}>{r.symbol}</span>
        {!r.live && (
          <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Soon</span>
        )}
      </motion.div>
      <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'white' : 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
        {r.name}
      </span>
    </motion.div>
  )
}

function TemplatesSection({ onStart }) {
  const [selected, setSelected] = useState(null)

  return (
    <section id="templates" className="bg-[#0a0a12] py-28 px-8">
      <div className="max-w-5xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Templates</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-5">
            Every faith.<br />Every family.
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-lg leading-relaxed">
            Your biodata should feel like it belongs to your tradition.
            Tap your faith to see the design crafted for you.
          </p>
        </motion.div>

        {/* Floating religion bubbles */}
        <div className="flex flex-wrap justify-center items-end gap-8 mb-12">
          {RELIGIONS.map((r, i) => (
            <ReligionBubble key={r.id} r={r} i={i} selected={selected} onSelect={setSelected} />
          ))}
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border overflow-hidden"
              style={{ borderColor: selected.live ? 'rgba(201,160,53,0.3)' : 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Close */}
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              {selected.live ? (
                <div className="flex flex-col lg:flex-row gap-0">
                  {/* Live preview */}
                  <div className="flex items-center justify-center p-10 lg:border-r border-white/8"
                    style={{ background: 'rgba(201,160,53,0.04)' }}>
                    <LivePreview scale={0.32} visibleH={400} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selected.symbol}</span>
                      <h3 className="font-serif text-3xl font-bold text-white">{selected.name}</h3>
                    </div>
                    <p className="text-amber-300/70 text-sm font-semibold tracking-widest uppercase mb-4">Available now</p>
                    <p className="text-white/50 leading-relaxed mb-8">{selected.desc}</p>
                    <ul className="space-y-2 mb-10">
                      {selected.features?.map(f => (
                        <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A035' }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={onStart} className="btn-primary self-start px-8 py-4 text-base">
                      Create with this template <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <span className="text-6xl mb-6">{selected.symbol}</span>
                  <h3 className="font-serif text-3xl font-bold text-white mb-3">{selected.name} Template</h3>
                  <p className="text-white/40 max-w-md leading-relaxed mb-6">{selected.desc}</p>
                  <span className="px-5 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                    In the works — coming soon
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
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

          {/* Floating live biodata preview */}
          <div className="flex-1 hidden lg:flex items-center justify-center relative h-[520px]">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LivePreview scale={0.29} visibleH={340} />
            </motion.div>
            <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(201,160,53,0.15) 0%, transparent 70%)' }} />
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
