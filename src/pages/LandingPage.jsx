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

/* ── Mini biodata preview card ── */
function MiniCard({ style, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute rounded-2xl overflow-hidden shadow-2xl ${className}`}
      style={style}
    >
      <div className="w-48 bg-white text-gray-800" style={{ fontSize: 7, lineHeight: 1.4 }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-3 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white text-base">👤</div>
          <div>
            <div className="text-white font-bold text-xs">Priya Sharma</div>
            <div className="text-purple-200 text-[8px]">Software Engineer · Bengaluru</div>
          </div>
        </div>
        {/* Body */}
        <div className="p-3 space-y-1.5">
          {[
            ['Age', '26 Years'], ['Height', "5'4\""],
            ['Religion', 'Hindu'], ['Education', 'B.Tech'],
            ['Family', 'Nuclear, Middle Class'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <span className="text-gray-400 w-14 shrink-0">{k}</span>
              <span className="text-gray-700 font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          <div className="text-[7px] text-purple-600 font-semibold uppercase tracking-wider mb-1">Hobbies</div>
          <div className="text-gray-600">Classical dance, Reading, Cooking</div>
        </div>
      </div>
    </motion.div>
  )
}

function MiniCardModern({ className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute rounded-2xl overflow-hidden shadow-2xl ${className}`}
    >
      <div className="w-44 bg-white text-gray-800 flex" style={{ fontSize: 7, lineHeight: 1.4 }}>
        {/* Sidebar */}
        <div className="w-14 bg-gradient-to-b from-rose-500 to-pink-600 p-2 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-base">👤</div>
          <div className="text-white text-center text-[6px] space-y-0.5">
            <div className="font-bold text-[7px]">Arjun</div>
            <div className="text-pink-200">26 yrs</div>
            <div className="text-pink-200">5'11"</div>
            <div className="mt-2 text-[6px] text-pink-200">📍 Mumbai</div>
            <div className="text-pink-200">📞 +91 ...</div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-2 space-y-1.5">
          <div className="text-[6px] text-rose-500 font-bold uppercase tracking-wider">Education</div>
          <div className="text-gray-700">MBA, IIM Ahmedabad</div>
          <div className="text-[6px] text-rose-500 font-bold uppercase tracking-wider mt-1">Family</div>
          <div className="text-gray-700">2 Brothers · Joint</div>
          <div className="text-[6px] text-rose-500 font-bold uppercase tracking-wider mt-1">Interests</div>
          <div className="text-gray-700">Cricket, Travel, Music</div>
        </div>
      </div>
    </motion.div>
  )
}

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

          {/* Right — floating biodata preview cards */}
          <div className="flex-1 hidden lg:block relative h-[500px]">
            {/* Classic card — back */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 right-16"
            >
              <MiniCard delay={0.4} className="shadow-[0_20px_80px_rgba(168,85,247,0.4)]" />
            </motion.div>
            {/* Modern card — front */}
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-32 right-0"
            >
              <MiniCardModern delay={0.6} className="shadow-[0_20px_80px_rgba(244,63,94,0.4)]" />
            </motion.div>
            {/* Glow behind cards */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-40 right-4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
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

      {/* ── TEMPLATES ── */}
      <section id="templates" className="bg-[#0a0a12] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Templates</p>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Marriage biodata templates</h2>
            <p className="text-white/50 max-w-md mx-auto">Pick a layout made for family sharing, horoscope details and wedding conversations.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Modern template preview */}
            <motion.div
              initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="group"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-white/5 group-hover:border-pink-500/30 transition-colors duration-500 group-hover:-translate-y-2 transition-transform duration-500">
                {/* Modern template mockup */}
                <div className="bg-white flex" style={{ minHeight: 340 }}>
                  <div className="w-2/5 bg-gradient-to-b from-rose-500 to-pink-700 p-6 flex flex-col items-center text-white">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4 ring-4 ring-white/30">👤</div>
                    <h3 className="font-serif text-xl font-bold text-center mb-1">Arjun Mehta</h3>
                    <p className="text-pink-200 text-sm text-center mb-6">Software Engineer</p>
                    <div className="space-y-2 text-sm text-pink-100 w-full">
                      {['📍 Mumbai', '📞 +91 98765...', '✉ arjun@...'].map(t => (
                        <div key={t} className="text-xs">{t}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-6 bg-white">
                    <div className="space-y-5">
                      {[
                        { title: 'Personal', rows: [['Age', '26 Years'], ['Height', "5'11\""]] },
                        { title: 'Education', rows: [['Degree', 'B.Tech CSE'], ['College', 'IIT Delhi']] },
                        { title: 'Family', rows: [['Father', 'Businessman'], ['Siblings', '1 Brother']] },
                      ].map(({ title, rows }) => (
                        <div key={title}>
                          <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">{title}</div>
                          {rows.map(([k, v]) => (
                            <div key={k} className="flex gap-3 text-sm text-gray-700 mb-1">
                              <span className="text-gray-400 w-20 shrink-0">{k}</span>
                              <span className="font-medium">{v}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <span className="text-white font-semibold text-lg">Telugu Wedding</span>
                <p className="text-white/40 text-sm mt-1">Sacred header · Family sections · Horoscope friendly</p>
              </div>
            </motion.div>

            {/* Classic template preview */}
            <motion.div
              initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="group"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/5 group-hover:border-purple-500/30 transition-colors duration-500 group-hover:-translate-y-2 transition-transform duration-500">
                {/* Classic template mockup */}
                <div className="bg-white" style={{ minHeight: 340 }}>
                  <div className="bg-gradient-to-r from-purple-800 to-violet-700 p-6 flex items-center gap-6">
                    <div className="flex-1">
                      <div className="text-purple-300 text-xs font-semibold tracking-widest uppercase mb-1">Matrimonial Biodata</div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-1">Priya Sharma</h3>
                      <p className="text-purple-200 text-sm">Software Engineer · Bengaluru</p>
                    </div>
                    <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-3xl ring-2 ring-white/30">👤</div>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {[
                      ['Date of Birth', '12 March 1998'], ['Height', "5'4\""],
                      ['Religion', 'Hindu · Brahmin'], ['Blood Group', 'B+'],
                      ['Education', 'B.Tech IT'], ['Company', 'Infosys'],
                      ['Father', 'Ramesh Sharma (Retired)'], ['Mother', 'Sunita Sharma (Homemaker)'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="text-purple-700 text-xs font-semibold uppercase tracking-wide">{k}</div>
                        <div className="text-gray-800 font-medium">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pb-6">
                    <div className="border-t border-purple-100 pt-4">
                      <div className="text-purple-700 text-xs font-semibold uppercase tracking-wide mb-1">Hobbies</div>
                      <div className="text-gray-700 text-sm">Classical dance · Reading · Cooking · Badminton</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <span className="text-white font-semibold text-lg">Royal Biodata</span>
                <p className="text-white/40 text-sm mt-1">Formal layout · Marriage-ready · Print friendly</p>
              </div>
            </motion.div>
          </div>
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
