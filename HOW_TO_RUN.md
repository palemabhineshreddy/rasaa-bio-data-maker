# How to Run Rasaa Bio Data Maker

## Prerequisites
- Node.js installed (v18 or higher recommended)
- Terminal / VS Code integrated terminal

---

## Step 1 — Open the project folder in terminal

```bash
cd "/Users/abhineshreddy/AI -Claude Projects/biodata-maker"
```

---

## Step 2 — Install dependencies (first time only)

```bash
npm install
```

---

## Step 3 — Start the development server

```bash
npm run dev
```

You will see:

```
VITE v8.x.x  ready in ~500ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## Other Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production → output goes to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Stop the server

Press **Ctrl + C** in the terminal.

---

## Deploy (Netlify / Cloudflare Pages)

1. Run `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Set build command: `npm run build`
4. Set publish directory: `dist`
