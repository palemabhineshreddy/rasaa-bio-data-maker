# Rasaa Bio Data Maker — CLAUDE.md

## Project Overview
A fully client-side React + Vite + Tailwind app for creating Indian marriage biodatas.
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
| `src/components/ModernTemplate.jsx` | Telugu Wedding PDF template layout |
| `src/components/ClassicTemplate.jsx` | Royal Biodata PDF template layout |

### MEDIUM PRIORITY
| File | What it controls |
|------|-----------------|
| `src/pages/LandingPage.jsx` | Landing copy, hero, features section, FAQ, template previews |
| `src/utils/pdfExport.js` | PDF rendering (html2canvas settings, page splitting, scale) |
| `src/index.css` | Global Tailwind base + custom classes (`.btn-primary`, `.form-input`, `.glass`, `.orb`, `.step-dot`) |

### LOW PRIORITY (rarely touch)
| File | What it controls |
|------|-----------------|
| `src/main.jsx` | React entry point |
| `vite.config.js` | Build config |
| `public/` | Static assets, PWA manifest, SEO files |

## Adding a New Form Field — Checklist
1. Add the field key + default value to `EMPTY_FORM` in `src/App.jsx`
2. Add a `<Field>` component call in the appropriate Step in `BuilderPage.jsx`
3. Add an entry to `FIELD_JUMPS` array in `BuilderPage.jsx` (for quick-jump nav)
4. Destructure and render the field in `ModernTemplate.jsx` AND `ClassicTemplate.jsx`

## Custom Fields System
Each custom field object: `{ id, section, customTitle, label, value }`
Sections: `'personal'`, `'career'`, `'family'`, `'horoscope'`, `'contact'`, `'custom'`
- `'custom'` section groups by `customTitle` in templates (user-defined section name)
- Templates filter out custom fields with empty label or value before rendering

## PDF Export Notes
- `pdfExport.js` captures the `ref` on the preview div using html2canvas
- Scale is capped at `Math.min(2, devicePixelRatio)` to keep file size reasonable
- Multi-page: splits canvas into `contentHeight`-tall slices per page
- If you change template height significantly, test PDF output — content can clip at page boundaries

## Known Issues / Watch Out
- `weight` field was added to `EMPTY_FORM` and Step1, and now renders in both templates (fixed)

## Template Color Themes
- **ModernTemplate** (Telugu Wedding): warm saffron/red palette — `red-900`, `amber-500`, `stone-800`, bg `#fffaf0`
- **ClassicTemplate** (Royal Biodata): rose/slate palette — `rose-950`, `rose-700`, `slate-800`, bg `#fff7f8`

## Dev Commands
```bash
npm run dev      # start dev server (Vite, port 5173)
npm run build    # production build → dist/
npm run preview  # preview production build
```
