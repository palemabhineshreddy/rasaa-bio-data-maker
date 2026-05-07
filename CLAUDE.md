# Bandhan — CLAUDE.md

## Project Overview
A fully client-side React + Vite + Tailwind app for creating Indian marriage biodatas.
Brand: **Bandhan** · Domain: **bandhan.app**
No backend, no auth, no database — all state lives in browser memory during the session.
Deployed on Netlify/Cloudflare Pages (dist/ folder, `_headers`, `_redirects` in public/).

## Stack
- React 18, Vite 8, Tailwind CSS 3
- framer-motion (animations), lucide-react (icons)
- html2canvas + jsPDF (PDF export — loaded lazily)
- No router — view switching via `useState` in App.jsx

## App Flow
`LandingPage` → (Create button) → `BuilderPage` (5 steps) → Preview + Download PDF

Builder steps (0-indexed):
- Step 0 → Personal (fullName required to advance)
- Step 1 → Career (occupation required to advance)
- Step 2 → Family
- Step 3 → About + Horoscope + Contact
- Step 4 → Photo + Template picker
- Step 5 (isPreview) → Preview + PDF download

## Files to Edit — Priority Reference

### HIGH PRIORITY (most changes happen here)
| File | What it controls |
|------|-----------------|
| `src/App.jsx` | `EMPTY_FORM` schema — add/remove form fields here first |
| `src/pages/BuilderPage.jsx` | Step components (Step1–Step5), `FIELD_JUMPS` config, nav logic, `canNext` validation |
| `src/components/PanIndiaTemplate.jsx` | Pan-India biodata template — the only active template |
| `src/utils/formatters.js` | Date formatting utility (`formatDate`) used by the template |

### MEDIUM PRIORITY
| File | What it controls |
|------|-----------------|
| `src/pages/LandingPage.jsx` | Landing copy, hero, features section, FAQ |
| `src/utils/pdfExport.js` | PDF export — single-page html2canvas snapshot |
| `src/index.css` | Global Tailwind base + custom classes |

### LOW PRIORITY (rarely touch)
| File | What it controls |
|------|-----------------|
| `src/main.jsx` | React entry point |
| `vite.config.js` | Build config |
| `public/` | Static assets, PWA manifest, SEO files |

## Adding a New Form Field — Checklist
1. Add the field key + default value to `EMPTY_FORM` in `src/App.jsx`
2. Add a `<Field>` component call in the appropriate Step in `BuilderPage.jsx`
3. Add an entry to `FIELD_JUMPS` array in `BuilderPage.jsx`
4. Destructure and render the field in `PanIndiaTemplate.jsx`

## Custom Fields System
Each custom field object: `{ id, section, customTitle, label, value }`
Sections: `'personal'`, `'career'`, `'family'`, `'horoscope'`, `'contact'`, `'custom'`
- `'custom'` section groups by `customTitle` in the template (user-defined section name)
- Template filters out custom fields with empty label or value before rendering

## PDF Export
- `pdfExport.js` captures the `.pdf-area` element with html2canvas at `scale: 2`
- PDF page size is set dynamically to match the element's exact CSS dimensions — **one page, no splitting, no added elements**
- Photo uses `background-image` + `background-size: cover` + `background-position` (NOT `<img object-fit>`) so html2canvas preserves the crop correctly

## Template — PanIndiaTemplate.jsx

### Layout
- Outer padding: `48px top, 52px left, 52px right, 28px bottom`
- Header: centred Sanskrit slogan `॥ श्री गणेशाय नमः ॥`
- Personal Details grid: `1fr 160px` (left = rows, right = photo if uploaded), gap `12px`
- Photo: `152×192px`, rendered as `background-image` div (no border)
- Photo column hidden entirely when no photo uploaded (grid collapses to `1fr`)
- Sections: Personal Details → Family Details → Contact & About → custom sections

### Section Headings (Divider component)
- Left-aligned, no lines
- `fontSize: 12`, `fontWeight: 900`, uppercase, `letterSpacing: 0.2em`, maroon (`COLOR_OUTER`)

### Row fields
- Label: `width: 148px`, `fontSize: 10.5`, `fontWeight: 700`, maroon label colour
- Colon: gold (`COLOR_GOLD`)
- Value: `fontSize: 10.5`, `fontWeight: 500`, dark (`COLOR_VALUE`)
- Father/Mother: `Name (Occupation)` format using parentheses

### PDF Field Order (Personal Details)
Name → Date of Birth → Age → Height → Weight → Blood Group → Religion → Community → Mother Tongue → Gender → Education → College → Occupation → Organisation → Annual Income → Work Location

### Color Theme
| Constant | Value | Use |
|----------|-------|-----|
| `COLOR_OUTER` | `#6B0F1A` | Maroon — outer border, section headings, label text |
| `COLOR_GOLD` | `#C9A035` | Gold — inner border, colons, corner ornaments |
| `COLOR_LABEL` | `#7B2D2D` | Row label text |
| `COLOR_VALUE` | `#1C0808` | Row value text |
| `COLOR_BG` | `#FDFDF9` | Background — premium near-white ivory |

### Dropdowns with blank default
All dropdowns start blank (user must explicitly choose):
- Gender: `['', 'Male', 'Female']`
- Blood Group: `['', 'A+', 'A-', ...]`
- Family Type: `['', 'Nuclear', 'Joint', 'Extended']`
- Family Status: `['', 'Middle Class', ...]`
- Manglik: `['', 'No', 'Yes', 'Partial']`

## Known Issues / Watch Out
- `object-fit` on `<img>` is ignored by html2canvas — always use `background-image` for photos in the template
- `inset` CSS shorthand not supported by html2canvas — use explicit `top/right/bottom/left`
- `borderBottom` on inline `<span>` renders inconsistently in html2canvas — use a separate `<div>` for underlines

## Dev Commands
```bash
npm run dev      # start dev server (Vite, port 5173)
npm run build    # production build → dist/
npm run preview  # preview production build
```
