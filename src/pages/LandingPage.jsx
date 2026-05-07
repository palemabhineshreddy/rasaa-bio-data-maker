import { motion } from 'framer-motion'
import { Sparkles, Shield, Download, ChevronRight, Heart, Lock, Zap } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}

/* ── Mini biodata card used in hero ── */
function BiodataCard() {
  return (
    <div style={{
      background: '#FDFDF9', width: 220, position: 'relative',
      boxShadow: '0 32px 80px rgba(201,160,53,0.25), 0 8px 24px rgba(0,0,0,0.3)',
      borderRadius: 3, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 5, right: 5, bottom: 5, left: 5, border: '1.5px solid #6B0F1A', pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 9, right: 9, bottom: 9, left: 9, border: '0.5px solid #C9A035', pointerEvents: 'none', zIndex: 2 }} />

      <div style={{ padding: '28px 18px 6px', textAlign: 'center', fontFamily: 'serif', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, color: '#C9A035', letterSpacing: '0.1em', marginBottom: 10 }}>॥ श्री गणेशाय नमः ॥</div>
      </div>

      {/* Personal details + photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 58px', gap: 6, padding: '0 14px 10px', position: 'relative', zIndex: 1 }}>
        <div>
          {[['Name','Priya Sharma'],['Date of Birth','12th March, 1998'],['Height',"5'4\""],['Religion','Hindu'],['Community','Brahmin / Iyer'],['Occupation','Software Engineer']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'baseline', padding: '2px 0' }}>
              <span style={{ width: 64, flexShrink: 0, fontSize: 5.5, fontWeight: 700, color: '#7B2D2D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</span>
              <span style={{ fontSize: 5.5, fontWeight: 700, color: '#C9A035', marginRight: 3 }}>:</span>
              <span style={{ fontSize: 6, color: '#1C0808', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 58, height: 74, background: 'linear-gradient(135deg,#e8d5c4,#d4b896)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👤</div>
      </div>

      {/* Section heading */}
      <div style={{ padding: '4px 14px 2px', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 6, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#6B0F1A' }}>Family Details</span>
      </div>
      <div style={{ padding: '0 14px 10px', position: 'relative', zIndex: 1 }}>
        {[['Father','Ramesh Sharma (Retd. Govt. Officer)'],['Mother','Sunita Sharma (Homemaker)'],['Native Place','Tirupati, Andhra Pradesh']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', padding: '2px 0' }}>
            <span style={{ width: 64, flexShrink: 0, fontSize: 5.5, fontWeight: 700, color: '#7B2D2D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</span>
            <span style={{ fontSize: 5.5, fontWeight: 700, color: '#C9A035', marginRight: 3 }}>:</span>
            <span style={{ fontSize: 6, color: '#1C0808', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '6px 14px 16px', textAlign: 'center', borderTop: '0.5px solid rgba(201,160,53,0.3)', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 5, color: '#9B7320', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Created with Bandhan · bandhan.app</span>
      </div>
    </div>
  )
}

/* ── Template preview cards ── */
const TEMPLATES = [
  {
    id: 'pan-india',
    live: true,
    label: 'Pan-India',
    tag: 'Available now',
    tagColor: '#22c55e',
    theme: { bg: '#FDFDF9', outer: '#6B0F1A', gold: '#C9A035', accent: '#7B2D2D' },
    slogan: '॥ श्री गणेशाय नमः ॥',
    desc: 'Lotus borders · Gold & maroon · Works across all Hindu communities',
    rows: [['Name','Priya Sharma'],['Religion','Hindu · Brahmin'],['Occupation','Software Engineer']],
  },
  {
    id: 'telugu',
    live: false,
    label: 'Telugu',
    tag: 'Coming soon',
    tagColor: '#f59e0b',
    theme: { bg: '#FFF8F0', outer: '#7C2D12', gold: '#EA580C', accent: '#92400E' },
    slogan: '॥ శ్రీ గణేశాయ నమః ॥',
    desc: 'Saffron & deep red · Traditional family-first layout · Horoscope ready',
    rows: [['పేరు','ప్రియా శర్మ'],['వృత్తి','సాఫ్ట్‌వేర్ ఇంజనీర్'],['రాశి','వృషభం']],
  },
  {
    id: 'punjabi',
    live: false,
    label: 'Punjabi',
    tag: 'Coming soon',
    tagColor: '#f59e0b',
    theme: { bg: '#F8F8FF', outer: '#1e3a5f', gold: '#c9a84c', accent: '#2d5282' },
    slogan: 'ੴ ਸਤਿ ਨਾਮੁ',
    desc: 'Navy & gold · Sikh-friendly · Clean modern format',
    rows: [['Name','Priya Sharma'],['Religion','Sikh'],['Occupation','Engineer']],
  },
  {
    id: 'muslim',
    live: false,
    label: 'Muslim',
    tag: 'Coming soon',
    tagColor: '#f59e0b',
    theme: { bg: '#F0FFF4', outer: '#14532d', gold: '#16a34a', accent: '#166534' },
    slogan: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
    desc: 'Green & white · Nikah Biodata format · Urdu-ready',
    rows: [['Name','Priya Khan'],['Religion','Muslim'],['Location','Hyderabad']],
  },
  {
    id: 'christian',
    live: false,
    label: 'Christian',
    tag: 'Coming soon',
    tagColor: '#f59e0b',
    theme: { bg: '#F0F4FF', outer: '#1e3a5f', gold: '#6366f1', accent: '#3730a3' },
    slogan: '✝ To God Be The Glory',
    desc: 'Ivory & indigo · Church-style · Denomination fields included',
    rows: [['Name','Priya Thomas'],['Religion','Christian'],['Denomination','Catholic']],
  },
  {
    id: 'jain',
    live: false,
    label: 'Jain',
    tag: 'Coming soon',
    tagColor: '#f59e0b',
    theme: { bg: '#FFFBF0', outer: '#78350f', gold: '#d97706', accent: '#92400e' },
    slogan: '॥ जय जिनेन्द्र ॥',
    desc: 'Amber & brown · Sect-specific fields · Minimalist elegance',
    rows: [['Name','Priya Jain'],['Sect','Digambar'],['Gotra','Kasyapa']],
  },
]

function TemplateCard({ t, i }) {
  const { theme } = t
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="relative group"
    >
      {/* Live / coming-soon badge */}
      <div className="absolute -top-3 left-4 z-10">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: t.tagColor + '22', color: t.tagColor, border: `1px solid ${t.tagColor}44` }}>
          {t.tag}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden border transition-all duration-300"
        style={{ borderColor: t.live ? 'rgba(201,160,53,0.4)' : 'rgba(255,255,255,0.08)', background: t.live ? 'rgba(201,160,53,0.05)' : 'rgba(255,255,255,0.02)' }}>

        {/* Mini template preview */}
        <div style={{ background: theme.bg, padding: 12, position: 'relative', minHeight: 140 }}>
          <div style={{ position: 'absolute', top: 4, right: 4, bottom: 4, left: 4, border: `1px solid ${theme.outer}`, pointerEvents: 'none', opacity: 0.6 }} />
          <div style={{ textAlign: 'center', fontFamily: 'serif', fontSize: 7, color: theme.gold, marginBottom: 6, paddingTop: 6, letterSpacing: '0.08em' }}>{t.slogan}</div>
          <div style={{ fontFamily: 'sans-serif' }}>
            {t.rows.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 4, marginBottom: 3, alignItems: 'baseline' }}>
                <span style={{ width: 52, flexShrink: 0, fontSize: 5.5, fontWeight: 700, color: theme.accent, textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontSize: 5.5, color: theme.gold, marginRight: 3, fontWeight: 700 }}>:</span>
                <span style={{ fontSize: 6.5, color: '#333', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          {!t.live && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Coming Soon</span>
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">{t.label}</span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">{t.desc}</p>
        </div>
      </div>
    </motion.div>
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

          {/* Floating biodata card */}
          <div className="flex-1 hidden lg:flex items-center justify-center relative h-[520px]">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <BiodataCard />
            </motion.div>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(201,160,53,0.15) 0%, transparent 70%)' }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0a0a12] to-transparent" />
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="bg-[#0a0a12] py-28 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-6">
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Templates</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-5">
              Every faith.<br />Every language. Every family.
            </h2>
            <p className="text-white/45 max-w-xl mx-auto text-lg leading-relaxed">
              A biodata should feel like it belongs to your culture — not a generic form.
              We're building dedicated templates for every Indian tradition.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-14">
            <span className="px-5 py-2 rounded-full glass text-sm text-amber-300/70 border border-amber-500/20">
              1 live · 5 more on the way
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {TEMPLATES.map((t, i) => <TemplateCard key={t.id} t={t} i={i} />)}
          </div>
        </div>
      </section>

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
