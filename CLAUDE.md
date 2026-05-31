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
| 3 | About + Horoscope + Contact (all toggleable, default OFF) | — |
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
| `src/pages/LandingPage.jsx` | Dark theme landing — copy, hero, template showcase, FAQ |
| `src/pages/LandingPageLight.jsx` | Light theme landing — same sections, light palette |
| `src/contexts/ThemeContext.jsx` | Builder light/dark theme tokens (`LIGHT`/`DARK`), `useBuilderTheme()`, default theme |
| `src/components/LivePreview.jsx` | Shared live preview component + `SAMPLE_BY_TEMPLATE` (used by both landing page and builder modal) |
| `src/contexts/LanguageContext.jsx` | Language state, auto-detect, `createT()` helper |
| `src/components/LanguageSwitcher.jsx` | Globe icon dropdown in nav (landing + builder) |
| `src/components/SortableFieldRow.jsx` | Drag-and-drop row wrapper with themed drag handle |
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

## Builder Theme System

### Overview
`src/contexts/ThemeContext.jsx` controls light/dark mode for the builder and both landing pages.
- **Default theme:** `light` — `useState('light')` in `ThemeProvider`. Users see the light builder first.
- `useTheme()` — returns `{ theme, setTheme }` for the toggle switch.
- `useBuilderTheme()` — returns the full token object (`LIGHT` or `DARK`). Every builder component calls `const T = useBuilderTheme()` and reads named tokens.

### Token pattern
All colours are named tokens — **never hardcode colours in components**. If a colour needs to differ between themes, add a token to both `LIGHT` and `DARK` in `ThemeContext.jsx`.

Key tokens (selected):
| Token | LIGHT | DARK |
|-------|-------|------|
| `pageBg` | `#f8f9fa` | `#060608` |
| `text` | `#0a0a0a` | `#ffffff` |
| `accentGold` | `#0a0a0a` (black) | `#F0B820` (gold) |
| `logoIconBg` | `#0a0a0a` | `linear-gradient(135deg, #C8960C, #F0B820)` |
| `logoIconColor` | `#ffffff` | `#1a0a00` |
| `logoIconShadow` | `0 3px 12px rgba(0,0,0,0.18)` | `0 3px 12px rgba(200,150,12,0.4)` |
| `dragHandleColor` | `rgba(0,0,0,0.22)` | `rgba(255,255,255,0.18)` |
| `dragHandleHover` | `rgba(0,0,0,0.55)` | `rgba(168,85,247,0.7)` |
| `textFaint` | `#9ca3af` | `rgba(255,255,255,0.35)` |

### Bandhan logo — "B" letter design
Logo uses a **"B" letter** (Georgia serif, bold) in a rounded box — not an icon.
- **Light theme:** black box (`#0a0a0a`) + white B (`#ffffff`)
- **Dark theme:** gold gradient box (`linear-gradient(135deg, #C8960C, #F0B820)`) + dark B (`#1a0a00`)
- Rendered in 4 locations: builder header, dark landing nav, dark landing footer, light landing nav, light landing footer.
- Builder header logo is **clickable** (`<button onClick={onBack}>`) — routes back to the home/landing page.

### Live preview panel buttons (light theme)
In the builder live preview panel, **Templates** and **Download** buttons are **black** (`#0a0a0a`) in light theme, not the default step idle colours. This is applied inline via `theme === 'light' ? '#0a0a0a' : T.stepIdleBg` conditionals directly in the JSX (not via tokens, since it's a one-off per-panel override).

---

## Builder Section Toggles

### How toggles work
Optional biodata sections are controlled by `sectionsEnabled` inside `formData`. Each section has an on/off pill switch rendered by the `SectionToggle` component.

```js
// BuilderPage.jsx
const DEFAULT_SECTIONS_ENABLED = {
  about: false,
  partnerExpectations: false,
  horoscope: false,
}
```

All three default to **OFF** — new users see a clean minimal form.

`EMPTY_FORM.sectionsEnabled` in `App.jsx` mirrors the same shape:
```js
sectionsEnabled: { about: false, partnerExpectations: false, horoscope: false }
```

### `applyEnabledSections(formData)`
Single function applied at all 3 output paths (live preview, PDF download, template modal). It zeroes out fields whose section is toggled off:
- `about` → clears `formData.about`
- `partnerExpectations` → clears `formData.partnerExpectations`
- `horoscope` → clears `rashi`, `nakshatra`, `gotra`, `manglik` + removes custom fields with `section === 'horoscope'`

### Current toggleable sections
| Toggle key | Section label | Fields covered |
|-----------|--------------|---------------|
| `about` | About Yourself | `about` text field |
| `partnerExpectations` | Partner Expectations | `partnerExpectations` text field |
| `horoscope` | Horoscope Details | `rashi`, `nakshatra`, `gotra`, `manglik` + horoscope custom fields |

**Removed:** `extraPersonal` toggle was deleted — extra fields are already available per-section via the custom fields system.

### Horoscope section (Step 1)
Horoscope is a full drag-and-drop section (like Personal/Career/Family/Contact) wrapped in `SectionToggle`. When toggled on, users can reorder Rashi/Nakshatra/Gotra/Manglik rows and add custom horoscope fields via `InlineCustomFields section="horoscope"`.

---

## Builder Drag-and-Drop System

### `SortableFieldRow` component (`src/components/SortableFieldRow.jsx`)
Wraps each draggable field row. Uses `@dnd-kit/sortable`.
- Drag handle: `GripVertical` icon from lucide-react.
- Handle colour is **themed** via `T.dragHandleColor` / `T.dragHandleHover` from `useBuilderTheme()`.
  - Light theme: `rgba(0,0,0,0.22)` → `rgba(0,0,0,0.55)` on hover (visible on white backgrounds).
  - Dark theme: `rgba(255,255,255,0.18)` → `rgba(168,85,247,0.7)` on hover.
- **Never hardcode `rgba(255,255,255,...)` for the handle** — it is invisible on the light theme background.

### `DragHint` component (inline in `BuilderPage.jsx`)
Faint centred hint text shown below every DnD block in both themes:
```
⠿ Hold and drag to reorder fields
```
Uses `T.textFaint` for colour (11px, letterSpacing 0.02em). Placed after each `</DndContext>` closing tag in: personal (Step1), horoscope (Step1), career (Step2), family (Step3), contact (Step4).

### DnD sections
`useSectionSort(keys, formData, updateForm)` hook manages field order state. Sections with DnD:
- Personal fields (Step1)
- Horoscope fields (Step1, inside SectionToggle)
- Career fields (Step2)
- Family fields (Step3)
- Contact fields (Step4)

---

### Architecture
```
src/i18n/translations.js     ← all translation keys + language list
src/contexts/LanguageContext.jsx  ← React context, auto-detect, createT()
src/components/LanguageSwitcher.jsx  ← globe icon dropdown UI
```

### Language-specific URL slugs
Each language maps to a unique URL path for SEO indexability:
```js
en  → bandhan.app/               hi  → bandhan.app/hindi-biodata-maker
te  → bandhan.app/telugu-biodata-maker    ta  → bandhan.app/tamil-biodata-maker
kn  → bandhan.app/kannada-biodata-maker   ml  → bandhan.app/malayalam-biodata-maker
bn  → bandhan.app/bengali-biodata-maker   mr  → bandhan.app/marathi-biodata-maker
gu  → bandhan.app/gujarati-biodata-maker
```
- When user switches language → `history.replaceState` updates URL silently (no new history entry)
- CloudFront `404 → /index.html` error page handles all language slug routes transparently
- `LANG_SLUGS`, `SLUG_TO_LANG`, `PAGE_TITLES` maps in `LanguageContext.jsx`

### Language detection order
1. **URL path** — highest priority (direct link / bookmark / Google click)
2. `localStorage.getItem('bandhan_lang')` (saved preference)
3. `navigator.language` browser setting
4. Falls back to `'en'`

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

### Logo — both landing pages
Nav and footer logos use the **"B" letter** design (same as builder header — see Builder Theme System above).
- `LandingPage.jsx` (dark): box uses `linear-gradient(135deg, #C8960C, #F0B820)`, B colour `#1a0a00`.
- `LandingPageLight.jsx` (light): box uses `#0a0a0a`, B colour `#ffffff`.
- `Heart` import is **still present** in both files — it is used in the features list and pill badge. Only the logo instances were replaced.

### "How it Works" section (dark landing) — connector line
The 3 step boxes are connected by a single absolute horizontal line (`top: 43, height: 2`). The step number boxes must have an **opaque background** or the line bleeds visually through them.
- Step number box background: `'linear-gradient(135deg, rgba(237,137,54,0.18), rgba(237,137,54,0.05)), #060608'`
- The `, #060608` suffix is the solid base layer (page background) that blocks the line. Without it the semi-transparent gradient lets the line show through the box.
- Do **not** remove the solid base when restyling this section.

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
- **Picker column** (`flex-1 min-w-0`): labelled group sections + 2-row grid scroller per group
- **Preview column:** `sm:w-52 md:w-64 lg:w-auto` — fixed width on tablet, auto on desktop; `sm:sticky sm:top-20`
- **Mobile preview:** clipped at `max-h-72` (288px) via wrapper — shows header + first section, enough to judge template style
- **Preview animation:** `motion.div key={formData.template}` slides up (`y: 14→0`) on every template change

### All-groups layout (no tab filter)
Step 6 shows **all 19 templates at once**, organised as 3 labelled sections (Classic Collection / Modern & Minimal / New Wave) with a divider line and count badge. No active-tab filtering — user sees everything immediately.

### `BuilderTemplateRow` Component
- **2-row CSS grid:** `display: grid; grid-auto-flow: column; grid-template-rows: repeat(2, auto); gap: 10px`
  - 7 cards → 4 columns (2+2+2+1); 5 cards → 3 columns (2+2+1)
  - Shows 4–6 cards at once vs 1–2 in old single-row layout
- **Scroll step:** 308px (2 columns at a time)
- **Scroll-aware ghost arrows:** same pattern as `TemplateRow` — `canLeft`/`canRight` state, `AnimatePresence` fade, no hard button background
- **Sample data fallback:** `const base = formData.fullName ? formData : DESIGN_SAMPLE` — shows rich sample persona when user hasn't entered their name yet, prevents blank template cards

### `DESIGN_SAMPLE` constant
Defined in `BuilderPage.jsx` after `TEMPLATE_GROUPS`. Used in `TemplateCard` and `DesignLivePreview` (via `previewFormData` in `Step6`) when `formData.fullName` is empty.

### `BuilderTemplateModal`
Full-screen template picker modal — mirrors the landing page `TemplateModal` exactly:
- Group tabs (Classic / Modern & Minimal / New Wave) + thumbnail strip + full preview pane + CTA
- **Opened by both Templates buttons** — mobile nav pill and right-panel button
- **Previews use `LivePreview`** (not `TemplateMiniPreview`) — same per-template personas and photos as the landing page, never live user data
- Replaces the old `TemplateCarouselModal` (arrow/swipe carousel) which is no longer used

### `LivePreview` shared component (`src/components/LivePreview.jsx`)
Extracted from `LandingPage.jsx` so both pages share identical previews:
- **Default export:** `LivePreview({ containerW, visibleH, shadow, template })` — scales `BioTemplate` to fit any container width
- **Named export:** `SAMPLE_BY_TEMPLATE` — 19 per-template persona objects with real AI-generated photos (one per template ID)
- Photos imported from `Images/AI_Female/` — 14 Classic/Modern photos + 5 New Wave personas
- `LandingPage.jsx` and `BuilderTemplateModal` both import from this file

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

### hreflang in `index.html`
9 `<link rel="alternate" hreflang="...">` tags pointing to language-specific URLs (mirrors sitemap).
`x-default` and `en` both point to `bandhan.app/`; all regional languages point to their slug URL.

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
- 9 separate `<url>` entries — root `/` + one per language slug (priority 0.9 each)
- Image sitemap extension (`xmlns:image`)
- hreflang annotations for all 9 languages via `xhtml:link` (`xmlns:xhtml`)
- Each language URL entry includes cross-references to x-default, its own hreflang, and en
- `lastmod`: 2026-05-21
- Submitted to Google Search Console; all 9 URLs manually requested for indexing

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
- `FeedbackModal`: full-screen backdrop blur modal, spring-animated card, shows instantly after PDF download
- Uses `@formspree/react` `useForm('xwvyrbpw')` hook — NOT raw fetch
- Emoji ratings 1–5 via `RATINGS` array (`{ score, emoji, labelKey }` — note `labelKey`, not `label`)
- Hidden Formspree fields: `rating`, `emoji`, `template`, `_subject`, `_replyto: hello@bandhan.app`
  - `_replyto` field is required to prevent Formspree spam filtering
- Auto-closes 1800ms after successful submit; Skip button available
- State flow: download starts → `setShowModal(false)` → PDF done → `setShowModal(true)`
  - Resetting to `false` at download start ensures modal re-appears on every new download in same session
- `DownloadCelebration` and `FeedbackWidget` components have been removed

---

## Known Issues / Watch Out
- `object-fit` on `<img>` ignored by html2canvas → use `background-image` for all photos in templates
- `inset` shorthand not supported by html2canvas → use explicit `top/right/bottom/left`
- `borderBottom` on inline `<span>` renders inconsistently in html2canvas → use a `<div>` for underlines
- Browser back button going to Google instead of landing: fixed via `history.pushState({ view: 'builder' }, '', '/')` in `goToBuilder()` and `popstate` listener in `App.jsx`. `onBack` must call `history.back()` (not `setView`) to trigger the popstate handler correctly.
- Language switcher dropdown clipped if nav has same z-index as sibling content → keep nav at `z-50`
- `italic` on Indic script text causes synthetic slant → glyphs overflow line box → gate italic on `lang === 'en'` only (hero headline2 AND bottom CTA title2)
- Indic hero headline2 that wraps on narrow screens (320px) → keep headline2 under 6 chars
- Hero floating cards at x: >±162px overflow the viewport at 1024–1227px → current values ±160, ±80 are safe; `overflowX: 'clip'` on section catches any edge cases
- `overflow-x: hidden` on the hero section would clip the language switcher dropdown → use `overflow-x: clip` instead (does not create new BFC)
- `BuilderTemplateRow` 2-row grid: odd card counts leave an empty cell in the last column — this is intentional and looks fine
- Drag handle hardcoded as `rgba(255,255,255,0.18)` is invisible in light theme → always use `T.dragHandleColor` / `T.dragHandleHover` tokens from `useBuilderTheme()`
- "How it Works" step boxes with semi-transparent backgrounds let the horizontal connector line bleed through → the box background must include a solid page-colour base (`, #060608`) as described in Landing Page Architecture

---

## Dev Commands
```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```
