import { motion } from 'framer-motion'
import { Sparkles, Shield, Download, ChevronRight, Heart, Star } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}

const FEATURES = [
  { icon: Shield, label: 'Private by Design', desc: 'Your details stay in your browser while you create and preview.' },
  { icon: Download, label: 'Instant PDF', desc: 'Download a marriage-ready PDF in one click. Ready to share with families.' },
  { icon: Sparkles, label: 'Indian Biodata Styles', desc: 'Traditional Telugu wedding and formal family biodata templates.' },
]

const STEPS = [
  { num: '01', title: 'Fill Your Details', desc: 'Personal, family, education, horoscope and contact details.' },
  { num: '02', title: 'Pick a Template', desc: 'Choose Telugu wedding style or a formal marriage biodata layout.' },
  { num: '03', title: 'Download & Share', desc: 'Get your PDF instantly. Share on WhatsApp in seconds.' },
]


export default function LandingPage({ onStart, onContinue, savedName }) {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="hero-gradient relative min-h-screen flex flex-col overflow-hidden">
        {/* Floating orbs */}
        <div className="orb w-96 h-96 top-[-10%] left-[-10%] bg-purple-600/30" />
        <div className="orb w-80 h-80 top-[20%] right-[-8%] bg-pink-500/25" />
        <div className="orb w-64 h-64 bottom-[10%] left-[30%] bg-blue-600/20" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <span className="font-serif text-xl font-semibold text-white">Rasaa Bio Data Maker</span>
          </motion.div>
          <div className="flex items-center gap-3">
            {savedName && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={onContinue}
                className="btn-ghost text-sm"
              >
                Continue — {savedName}
              </motion.button>
            )}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={onStart}
              className="btn-primary text-sm"
            >
              {savedName ? 'Start Fresh' : 'Create Free'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-8 py-16 gap-12">
          {/* Left text */}
          <div className="flex-1 max-w-xl">
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 mb-8"
            >
              <Sparkles className="w-4 h-4" /> No sign-up · No storage · Completely free
            </motion.div>

            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="show"
              className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            >
              Create a Beautiful{' '}
              <span className="gradient-text italic">Marriage Biodata</span>
            </motion.h1>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="show"
              className="text-lg text-white/60 leading-relaxed mb-10"
            >
              Rasaa helps families create a clean, traditional Indian marriage biodata in minutes.
              Add personal, family, education and horoscope details, then download a polished PDF.
            </motion.p>

            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-wrap gap-4"
            >
              {savedName ? (
                <>
                  <button onClick={onContinue} className="btn-primary text-base px-8 py-4">
                    Continue Biodata <ChevronRight className="w-5 h-5" />
                  </button>
                  <button onClick={onStart} className="btn-ghost text-base px-8 py-4">
                    Start Fresh
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onStart} className="btn-primary text-base px-8 py-4">
                    Create Free Biodata <ChevronRight className="w-5 h-5" />
                  </button>
                  <a href="#templates" className="btn-ghost text-base px-8 py-4">
                    See Templates
                  </a>
                </>
              )}
            </motion.div>
            {savedName && (
              <motion.p
                custom={3.5} variants={fadeUp} initial="hidden" animate="show"
                className="text-sm text-green-400/80 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Your progress for <span className="font-semibold">{savedName}</span> is saved — pick up where you left off
              </motion.p>
            )}

            {/* Trust badges */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="flex items-center gap-6 mt-10 text-sm text-white/40"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-400" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-400" />
                <span>PDF in seconds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Free forever</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Shubh Vivah floating preview */}
          <div className="flex-1 hidden lg:flex items-center justify-center relative h-[500px]">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div style={{ background: '#FDFAF4', width: 200, padding: 10, position: 'relative', boxShadow: '0 20px 80px rgba(201,160,53,0.3)', borderRadius: 2 }}>
                <div style={{ position: 'absolute', inset: 4, border: '1.5px solid #6B0F1A', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', inset: 7, border: '0.5px solid #C9A035', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ textAlign: 'center', padding: '20px 10px 8px', fontFamily: 'serif' }}>
                  <div style={{ fontSize: 16, color: '#C9A035' }}>ॐ</div>
                  <div style={{ fontSize: 6, color: '#9B7320', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 6 }}>Shubh Vivah</div>
                  <div style={{ height: '0.5px', background: '#C9A035', opacity: 0.5, margin: '0 auto 6px', width: 80 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#3D0505', marginBottom: 2 }}>Priya Sharma</div>
                  <div style={{ fontSize: 6, color: '#7B2D2D', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Marriage Biodata</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                  <div style={{ width: 40, height: 48, border: '1px solid #C9A035', background: 'linear-gradient(135deg,#FFF0DC,#FFE4B5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                </div>
                <div style={{ padding: '0 10px 12px', fontFamily: 'sans-serif' }}>
                  {[['Age','26 Yrs'],['Religion','Hindu'],['Occ.','Engineer']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', gap: 4, marginBottom: 3, borderLeft: '1.5px solid rgba(201,160,53,0.4)', background: 'rgba(255,248,238,0.8)', padding: '2px 5px' }}>
                      <span style={{ fontSize: 5.5, fontWeight: 700, textTransform: 'uppercase', color: '#7B2D2D', width: 30, flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: 7, color: '#1C0808', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a12] to-transparent" />
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-[#0a0a12] py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Why Rasaa</p>
            <h2 className="font-serif text-4xl font-bold text-white">Built for Indian families</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 group hover:border-purple-500/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#080810] py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple as 1-2-3</p>
            <h2 className="font-serif text-4xl font-bold text-white">How it works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0" />

            {STEPS.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 relative z-10">
                  <span className="font-serif text-2xl font-bold text-white">{num}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATE ── */}
      <section id="templates" className="bg-[#0a0a12] py-24 px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">🪷 Shubh Vivah Template</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">A biodata that feels like a wedding invitation</h2>
            <p className="text-white/50 max-w-lg mx-auto">Lotus corner borders, gold accents, parchment background — designed for Indian families across every region.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 border border-amber-500/20 mx-auto max-w-sm"
          >
            {/* Shubh Vivah mockup */}
            <div style={{ background: '#FDFAF4', padding: 16, position: 'relative', fontFamily: 'serif' }}>
              {/* Border */}
              <div style={{ position: 'absolute', inset: 6, border: '2px solid #6B0F1A', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 10, border: '1px solid #C9A035', pointerEvents: 'none' }} />
              {/* Header */}
              <div style={{ textAlign: 'center', padding: '24px 16px 10px' }}>
                <div style={{ fontSize: 20, color: '#C9A035', marginBottom: 2 }}>ॐ</div>
                <div style={{ fontSize: 7, color: '#9B7320', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>Shubh Vivah</div>
                <div style={{ height: '0.5px', background: '#C9A035', opacity: 0.6, margin: '0 auto 8px', width: 120 }} />
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#3D0505', marginBottom: 3 }}>Priya Sharma</div>
                <div style={{ fontSize: 7, letterSpacing: '0.2em', color: '#7B2D2D', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Marriage Biodata</div>
              </div>
              {/* Mini photo */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div style={{ width: 52, height: 62, border: '1.5px solid #C9A035', background: 'linear-gradient(135deg,#FFF0DC,#FFE4B5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
              </div>
              {/* Info cards */}
              <div style={{ padding: '0 16px 16px', fontFamily: 'sans-serif' }}>
                {[['Age','26 Years'],['Height',"5'4\""],['Religion','Hindu · Brahmin'],['Occupation','Software Engineer']].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', gap: 6, marginBottom: 5, paddingLeft: 6, borderLeft: '2px solid rgba(201,160,53,0.4)', background: 'rgba(255,248,238,0.8)', padding: '4px 8px' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', color: '#7B2D2D', width: 56, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 9, color: '#1C0808', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {['Lotus corner borders','Gold & maroon palette','Parchment background','Pan-India auspicious design','All sections included'].map(f => (
              <span key={f} className="px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-300/80 text-sm">{f}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEO GUIDE ── */}
      <section className="bg-[#080810] py-24 px-8">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <p className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-3">Biodata Guide</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-5">How to make a good marriage biodata</h2>
            <p className="text-white/55 leading-relaxed">
              A strong marriage biodata should be easy for families to scan. Start with name, age, height,
              education, profession and location. Add family background, native place, community, horoscope
              details and contact information. Rasaa keeps these sections organized so the final PDF feels
              like a marriage biodata, not a job resume.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4"
          >
            {[
              ['What details should I include?', 'Personal details, education, profession, family background, horoscope details, photo and contact information. Rasaa has dedicated sections for each.'],
              ['Can I edit after preview?', 'Yes. Use the quick-jump bar at the top to go directly to any field, make your changes, and return to preview instantly.'],
              ['Is it free?', 'Yes, the core builder is completely free — no sign-up, no payment, no hidden steps.'],
              ['How do I share the biodata on WhatsApp?', 'Download the PDF, then use the Share on WhatsApp button that appears. The PDF attaches directly in WhatsApp for families to view.'],
              ['Will my data be saved if I close the tab?', 'Yes. Rasaa auto-saves your progress in your browser. When you return, your details are waiting — just click Continue.'],
              ['Which format is best for Telugu families?', 'The Telugu Wedding template uses a traditional saffron-and-red layout with a sacred header, family-first sections, and space for full horoscope details including Rashi, Nakshatra, Gotra and Manglik status.'],
            ].map(([q, a]) => (
              <div key={q} className="border border-white/10 bg-white/5 p-5 rounded-lg">
                <h3 className="text-white font-semibold mb-2">{q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero-gradient py-28 px-8 relative overflow-hidden">
        <div className="orb w-96 h-96 top-[-50%] left-[20%] bg-purple-600/30" />
        <div className="orb w-64 h-64 bottom-[-30%] right-[10%] bg-pink-500/25" />
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to create your{' '}
            <span className="gradient-text italic">Rasaa biodata?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Start free today. Add premium templates and paid tools later as your audience grows.
          </p>
          <button onClick={onStart} className="btn-primary text-lg px-12 py-5">
            Start Creating Now <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080810] py-8 px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="font-serif">Rasaa Bio Data Maker</span>
          </div>
          <p className="text-white/30 text-sm">Your data never leaves your browser · 100% Private · Free</p>
        </div>
      </footer>
    </div>
  )
}
