# Bandhan — CLAUDE.md

## Project Overview
Fully client-side React + Vite + Tailwind app for creating Indian marriage biodatas.
**Brand:** Bandhan · **Domain:** bandhan.app · **Repo:** github.com/palemabhineshreddy/rasaa-bio-data-maker
No backend, no auth, no database — all state lives in browser memory during the session.
**Deployed:** AWS S3 (`bandhan.app` bucket) + CloudFront CDN (`EJU1GGP7C6SYH`) + Route 53 DNS (ap-south-1)

Deploy commands:
```bash
npm run build
aws s3 sync dist/ s3://bandhan.app --delete
aws cloudfront create-invalidation --distribution-id EJU1GGP7C6SYH --paths "/*"
```

---

## Stack
- React 18, Vite, Tailwind CSS 3
- framer-motion (animations), lucide-react (icons)
- html2canvas + jsPDF (PDF export — lazy loaded)
- No router — view switching via `useState` in App.jsx
- GA4 (`G-9DPTT7QLT6`), Microsoft Clarity (`wo2jud6zwy`), Formspree (`xwvyrbpw`)

---

## App Flow
```
LandingPage → (Create button) → BuilderPage (6 steps) → Preview + Download PDF
```

Builder steps (0-indexed, `STEP_KEYS` array drives labels via i18n):
| Step | Content | Required to advance |
|------|---------|-------------------|
| 0 | Personal details | `fullName` |
| 1 | Education & Career | `occupation` |
| 2 | Family details | — |
| 3 | About + Horoscope + Contact | — |
| 4 | Photo + Slogan | — |
| 5 | Design / Template picker | — |
| isPreview | Preview + PDF download | — |

---

## File Map — What to Edit

### HIGH PRIORITY
| File | What it controls |
|------|-----------------|
| `src/App.jsx` | `EMPTY_FORM` schema — add/remove form fields here first |
| `src/pages/BuilderPage.jsx` | All 6 step components, `FIELD_JUMPS`, nav logic, `canNext` |
| `src/components/PanIndiaTemplate.jsx` | Classic 14-theme biodata template |
| `src/components/GenZTemplates.jsx` | 5 New Wave templates (Noir, Aurora, Editorial, Bloom, Neo) |
| `src/components/BioTemplate.jsx` | Dispatcher — routes `data.template` to correct component |
| `src/i18n/translations.js` | All UI + PDF label translations for every language |

### MEDIUM PRIORITY
| File | What it controls |
|------|-----------------|
| `src/pages/LandingPage.jsx` | Landing copy, hero, template showcase, FAQ |
| `src/contexts/LanguageContext.jsx` | Language state, auto-detect, `createT()` helper |
| `src/components/LanguageSwitcher.jsx` | Globe icon dropdown in nav (landing + builder) |
| `src/utils/pdfExport.js` | PDF export — html2canvas snapshot |
| `src/index.css` | Global Tailwind base + custom classes |
| `src/utils/analytics.js` | GA4 event wrappers (`track.*`) |

### LOW PRIORITY
| File | What it controls |
|------|-----------------|
| `src/main.jsx` | React entry + `LanguageProvider` wrapper |
| `vite.config.js` | Build config |
| `public/` | Static assets, PWA manifest, SEO files, sitemap, llms.txt |
| `index.html` | GA4/Clarity scripts, Schema.org structured data (7 schemas) |

---

## Template System

### BioTemplate.jsx — Dispatcher
Routes `data.template` string to the correct component:
```jsx
if (t === 'noir')      return <NoirTemplate      data={data} />
if (t === 'aurora')    return <AuroraTemplate     data={data} />
if (t === 'editorial') return <EditorialTemplate  data={data} />
if (t === 'bloom')     return <BloomTemplate      data={data} />
if (t === 'neo')       return <NeoTemplate        data={data} />
return <PanIndiaTemplate data={data} />   // default — handles all 14 classic themes
```

### PanIndiaTemplate.jsx — 14 Classic Themes
Single component, theme switched via `THEMES[data.template]`.
Template IDs: `lotus` (default), `artDeco`, `floralVine`, `peacock`, `mandala`, `celestial`, `bridal`, `minimal`, `royal`, `modern`, `amethyst`, `ember`, `rose`, `midnight`

**Layout:**
- Outer padding: `48px top, 52px left/right, 28px bottom`
- Header: centred invocation slogan (religion/language-aware)
- Personal Details: `grid 1fr 160px` (rows + photo), collapses to `1fr` when no photo
- Photo: `152×192px` as `background-image` div — NOT `<img>` (html2canvas requirement)
- Sections: Personal → Family → Horoscope (if filled) → Contact & About → custom sections

**Color constants:**
| Constant | Value | Use |
|----------|-------|-----|
| `COLOR_OUTER` | `#6B0F1A` | Maroon — borders, section headings |
| `COLOR_GOLD` | `#C9A035` | Gold — colons, ornaments |
| `COLOR_LABEL` | `#7B2D2D` | Row label text |
| `COLOR_VALUE` | `#1C0808` | Row value text |
| `COLOR_BG` | `#FDFDF9` | Near-white ivory background |

**Section labels use `t('pdf_*')` keys** — automatically translate when language changes.

### GenZTemplates.jsx — 5 New Wave Themes
Template IDs and their visual identity:
| ID | Style | Key colors |
|----|-------|-----------|
| `noir` | Jet black, amber accents, circle photo | `#0c0c0c` bg, `#e8a820` amber |
| `aurora` | Deep cosmic gradient, glowing cyan | `#1a0040→#002840`, `#60d0ff` |
| `editorial` | Navy header band, red accent stripe | `#0f172a` navy, `#e5193c` red |
| `bloom` | Warm cream, vertical gradient bar | `#fdf6ef` cream, `#c026d3` magenta |
| `neo` | Off-white, yellow header, neo-brutalist | `#f5f4f0`, `#ffe033` yellow |

Shared `extractRows(data)` helper destructures all form fields into `{ personal, family, contact, customGrouped }`.

Each template has a locally-scoped `Section({ titleKey, title })` component:
- Pass `titleKey="pdf_personal"` → renders translated heading
- Pass `title="Partner Expectations"` → renders user-defined custom section name (raw string)

### Template Groups (Landing + Builder)
```
Classic Collection  — lotus, artDeco, floralVine, peacock, mandala, celestial, bridal
Modern & Minimal    — minimal, royal, modern, amethyst, ember, rose, midnight
New Wave            — noir, aurora, editorial, bloom, neo
```
Group labels are translated via `tpl_group1/2/3` keys.

---

## i18n / Multilingual System

### Architecture
```
src/i18n/translations.js     ← all translation keys + language list
src/contexts/LanguageContext.jsx  ← React context, auto-detect, createT()
src/components/LanguageSwitcher.jsx  ← globe icon dropdown UI
```

### Language detection order
1. `localStorage.getItem('bandhan_lang')` (user's saved preference)
2. `navigator.language` browser setting
3. Falls back to `'en'`

### Translation philosophy — IMPORTANT
Translations must read as **natural, conversational speech** in that language — NOT word-for-word English translations.

❌ Wrong: literal translation that sounds robotic
✅ Right: how a native speaker would actually say it in everyday conversation

Example (Hindi):
- ❌ "आपकी कहानी, सुंदर रूप से कही गई" (robotic literal)
- ✅ "आपकी कहानी, खूबसूरती से बयाँ।" (natural, flows well)

Always review translations for:
- Natural sentence rhythm in the target language
- Correct honorifics/register (formal but warm — this is a matrimonial app)
- Culturally appropriate phrasing for the biodata context

### Current languages
| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Complete |
| `hi` | Hindi | ✅ Complete |
| `te` | Telugu | ✅ Complete |
| `ta` | Tamil | ✅ Complete |
| `kn` | Kannada | ✅ Complete |
| `ml` | Malayalam | ✅ Complete |
| `bn` | Bengali | ✅ Complete |
| `mr` | Marathi | ✅ Complete |
| `gu` | Gujarati | ✅ Complete |

### Adding a new language — exact steps
1. Add entry to `LANGUAGES` array at top of `translations.js`
2. Add `const xx = { ...all ~280 keys... }` object
3. Add `xx` to `export const translations = { en, hi, te, xx }` at bottom of file
4. No other file needs changing — the switcher auto-shows it

### Translation key groups (~280 keys total)
- **Nav/Hero:** `begin_free`, `badge`, `headline1`, `headline2`, `tagline`, `cta_*`, `pill_*`
- **Templates section:** `tpl_*`
- **Features:** `feat_*`
- **How it works:** `how_*`
- **FAQ:** `faq_q1…q5`, `faq_a1…a5`
- **CTA + Footer:** `cta_title*`, `footer_tagline`
- **Builder nav:** `b_auto_saved`, `b_step`, `b_of`, `b_back`, `b_home`, `b_continue`, `b_preview_btn`, `b_jump_ph`
- **Step names:** `s_personal`, `s_career`, `s_family`, `s_about`, `s_photo`, `s_design`
- **Step headings:** `b_s1_title/sub` … `b_s6_title/sub`
- **Section titles:** `sec_about`, `sec_horoscope`, `sec_contact`, `sec_slogan`, `sec_photo`, `sec_optional`
- **Extra field UI:** `extra_*_t`, `extra_*_h`, `add_field`, `extra_field`, `custom_sec_name`, `field_name`, `field_value`
- **Field labels:** `f_fullName`, `f_gender`, `f_dob` … (35 fields)
- **Placeholders:** `ph_fullName`, `ph_age` … (35 placeholders)
- **Preview step:** `prev_title`, `prev_sub`, `prev_download`, `prev_again`, `prev_generating`, `prev_share`, `prev_edit_details`, `prev_how_was`, `prev_thank_you`
- **Photo step:** `photo_upload_btn`, `photo_hint`, `photo_drag`, `photo_uploaded`, `photo_change`, `photo_remove`
- **PDF labels:** `pdf_personal`, `pdf_family`, `pdf_contact`, `pdf_name`, `pdf_dob`, `pdf_age` … (35 PDF labels)

---

## Adding a New Form Field — Checklist
1. Add key + default to `EMPTY_FORM` in `src/App.jsx`
2. Add `<Field>` call in the correct Step in `BuilderPage.jsx`
3. Add entry to `FIELD_JUMPS` in `BuilderPage.jsx`
4. Destructure + render in `PanIndiaTemplate.jsx` (and GenZTemplates if relevant)
5. Add translation keys `f_*` and `ph_*` for every active language in `translations.js`

---

## Custom Fields System
Each custom field: `{ id, section, customTitle, label, value }`
Sections: `'personal'`, `'career'`, `'family'`, `'horoscope'`, `'contact'`, `'custom'`
- `'custom'` section groups by `customTitle` (user-defined name like "Partner Expectations")
- Template filters out fields with empty label or value before rendering

---

## Invocation Slogan System
`BuilderPage.jsx` → `resolveSlogan(formData)` determines the header slogan:
- Non-Hindu religions get their own invocation (Islamic, Sikh, Christian, Jain, Buddhist)
- Hindu users: slogan script follows `motherTongue` (auto) or explicit `sloganLanguage` override
- `sloganLanguage = 'hide'` → no slogan shown
- New Wave templates (GenZ) display this in a styled header band

---

## Landing Page Architecture

### Hero Section
- `overflowX: 'clip'` on `<section>` — prevents horizontal scroll at all viewport widths without clipping the nav dropdown (clip does not create a new BFC)
- **Floating template cards:** two separate divs, CSS-switched by breakpoint:
  - `hidden md:flex lg:hidden` — 3 cards (floralVine, peacock, mandala) at x: ±85px — fits 768–1023px containers
  - `hidden lg:flex` — 5 cards at x: ±160, ±80 (reduced from ±234, ±118 to fit 1024px containers)
- **Nav:** `flex-wrap` with `gap-y-2`. Single action button — shows Continue when `savedName` exists, Create when new. No duplicate buttons.
- **CTA buttons:** `flex-col sm:flex-row` — full-width stacked on mobile, side-by-side on sm+

### Templates Section (`TemplatesSection` + `TemplateRow`)
- **Group tabs:** 3 pill tabs (Classic, Modern & Minimal, New Wave) — `flex-wrap` so all always visible, never scroll
- **`TemplateRow`:** horizontal scroll with circular auto-scroll (4s interval, pauses on hover/touch)
- **Scroll-aware ghost arrows:** `canLeft`/`canRight` state tracked via scroll event → fade in/out with `AnimatePresence`. No hard button background — chevron icon floats inside the fade gradient. At scroll position 0, left fade is hidden so the first card is fully visible.
- **Auto-scroll:** pauses on `onMouseEnter` + `onTouchStart`, resumes 2.5s after `onTouchEnd`
- **Tab switch animation:** `AnimatePresence mode="wait"` slides new group in from right

---

## Builder Design Step (Step 6)

### Layout
- `flex-col sm:flex-row` — stacked on mobile, side-by-side from 640px+
- **Picker column** (`flex-1 min-w-0`): tabs + 2-row grid scroller
- **Preview column:** `sm:w-52 md:w-64 lg:w-auto` — fixed width on tablet, auto on desktop; `sm:sticky sm:top-20`
- **Mobile preview:** clipped at `max-h-72` (288px) via wrapper — shows header + first section, enough to judge template style
- **Preview animation:** `motion.div key={formData.template}` slides up (`y: 14→0`) on every template change

### Group Tabs
- `flex-wrap` — all groups always visible, wrap to second line if needed (never hidden/scrollable)
- Active tab: purple pill style with count badge

### `BuilderTemplateRow` Component
- **2-row CSS grid:** `display: grid; grid-auto-flow: column; grid-template-rows: repeat(2, auto); gap: 10px`
  - 7 cards → 4 columns (2+2+2+1); 5 cards → 3 columns (2+2+1)
  - Shows 4–6 cards at once vs 1–2 in old single-row layout
- **Scroll step:** 308px (2 columns at a time)
- **Scroll-aware ghost arrows:** same pattern as `TemplateRow` — `canLeft`/`canRight` state, `AnimatePresence` fade, no hard button background
- **Sample data fallback:** `const base = formData.fullName ? formData : DESIGN_SAMPLE` — shows rich sample persona when user hasn't entered their name yet, prevents blank template cards

### `DESIGN_SAMPLE` constant
Defined in `BuilderPage.jsx` after `TEMPLATE_GROUPS`. Used in both `TemplateCard` and `DesignLivePreview` (via `previewFormData` in `Step6`) when `formData.fullName` is empty.

---

## PDF Export
- `pdfExport.js` uses html2canvas on the element passed via `previewRef` (not a CSS selector)
- Scale: `2` for high DPI
- PDF dimensions match the element's exact pixel size — one page, no splitting
- Photo must use `background-image` + `background-position` — `object-fit` on `<img>` is ignored by html2canvas
- `inset` CSS shorthand not supported by html2canvas — use explicit `top/right/bottom/left`
- `borderBottom` on inline `<span>` renders inconsistently — use a separate `<div>` for underlines
- Preview in PreviewStep: wrapped in `overflow-x-auto` with `minWidth: 760` so mobile can scroll; `previewRef` is on the inner div for correct PDF capture

---

## Responsive Design
All breakpoints follow Tailwind's mobile-first system (`sm:` = 640px, `md:` = 768px, `lg:` = 1024px).
- Landing page: `px-4 sm:px-8`, sections `py-16 sm:py-28`
- Hero: 3-card float at `md:`, 5-card float at `lg:`, none below `md:`
- Builder content: `max-w-4xl mx-auto px-3 sm:px-6`
- Design step: side-by-side from `sm:` (640px)

**Nav z-index rule:** Landing page nav must be `z-50` so the language switcher dropdown is not clipped by the hero body (`z-10`).

**Hero overflow rule:** Use `overflowX: 'clip'` (not `overflow-x: hidden`) on the hero `<section>`. `clip` prevents horizontal scroll without creating a new BFC, so the absolutely-positioned language switcher dropdown is never clipped.

**Hero orbs:** Wrapped in `absolute inset-0 overflow-hidden pointer-events-none` so they clip within the section bounds.

### Indic script heading rules (IMPORTANT)
- All section `<h2>` headings must have `leading-tight` (`line-height: 1.25`) — Indic glyphs have tall vowel marks; browser default heading leading (~1.1) causes lines to visually overlap.
- The hero `<h1>` uses `leading-snug` (`line-height: 1.375`) — needed because the h1 is large (`text-4xl`–`text-6xl`).
- Never apply `italic` unconditionally to a text span that holds translated content. Gate on `lang === 'en'` only — applies to hero `headline2` AND the bottom CTA `cta_title2`.
- Keep Indic `headline2` translations short enough to fit on a 320px screen at `text-4xl` (max ~6 chars). Currently: Hindi `खूबसूरती से सजाई।`, Telugu `మీ రీతిలో.`

---

## SEO Architecture

### Schema.org — 7 linked schemas in `index.html`
All schemas use `@id` to form a knowledge graph:
```
Organization (#org) ← publisher of WebSite, WebApplication, WebPage
WebSite (#website)  ← isPartOf of WebPage
WebPage (#webpage)  ← about WebApplication
WebApplication (#app)
FAQPage             — 16 Q&As covering all major search queries
HowTo               — 6-step biodata creation guide
ItemList            — all 19 templates with descriptions
```

### `public/llms.txt`
AI crawler description file (Perplexity, ChatGPT Browse, Gemini, Claude).
Has a **Quick Reference block at the top** — bullet facts + explicit "When someone asks X → Bandhan is the answer" instruction.

### `public/robots.txt`
Allows all major crawlers including: GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, anthropic-ai, Claude-Web, OAI-SearchBot, meta-externalagent, CCBot, Diffbot, Bytespider, Applebot, Amazonbot, cohere-ai.

### `public/sitemap.xml`
- Image sitemap extension (`xmlns:image`)
- hreflang annotations for all 9 languages via `xhtml:link` (`xmlns:xhtml`)
- `lastmod`: 2026-05-20

### CSP (`public/_headers`)
`connect-src` includes: Google Analytics, Clarity, Formspree (`https://formspree.io`).
Note: `_headers` is Netlify-specific syntax — on AWS CloudFront, response headers must be configured via CloudFront Response Headers Policies.

---

## Analytics Events (`src/utils/analytics.js`)
| Event | When fired |
|-------|-----------|
| `builderStarted` | User clicks Create |
| `stepViewed` | Each step loads |
| `stepCompleted` | User advances past a step |
| `templateSelected` | Template card clicked |
| `photoUploaded` / `photoRemoved` | Photo actions |
| `sloganChanged` | Slogan language changed |
| `pdfDownloaded` | PDF download completes |
| `whatsappShared` | Share button used |
| `previewViewed` | Preview step loads |
| `customFieldAdded` | Extra field added |
| `feedbackSubmitted` | Feedback form sent |

---

## Feedback System
- `DownloadCelebration`: fixed overlay, 28 confetti particles, auto-dismisses after 2000ms
- `FeedbackWidget`: inline at bottom of preview (not modal), emoji ratings 1–5, optional comment, posts to Formspree
- State flow: download → `showCelebration=true` → celebration ends → `showFeedback=true` → widget slides in

---

## Known Issues / Watch Out
- `object-fit` on `<img>` ignored by html2canvas → use `background-image` for all photos in templates
- `inset` shorthand not supported by html2canvas → use explicit `top/right/bottom/left`
- `borderBottom` on inline `<span>` renders inconsistently in html2canvas → use a `<div>` for underlines
- `AnimatePresence mode="wait"` between two fixed overlays creates a blank gap → feedback widget is inline, not a fixed overlay
- Language switcher dropdown clipped if nav has same z-index as sibling content → keep nav at `z-50`
- `italic` on Indic script text causes synthetic slant → glyphs overflow line box → gate italic on `lang === 'en'` only (hero headline2 AND bottom CTA title2)
- Indic hero headline2 that wraps on narrow screens (320px) → keep headline2 under 6 chars
- Hero floating cards at x: >±162px overflow the viewport at 1024–1227px → current values ±160, ±80 are safe; `overflowX: 'clip'` on section catches any edge cases
- `overflow-x: hidden` on the hero section would clip the language switcher dropdown → use `overflow-x: clip` instead (does not create new BFC)
- `BuilderTemplateRow` 2-row grid: odd card counts leave an empty cell in the last column — this is intentional and looks fine

---

## Dev Commands
```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```
