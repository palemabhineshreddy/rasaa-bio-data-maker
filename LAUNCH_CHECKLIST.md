# Bandhan — Launch Checklist
Complete these in order. Everything in the codebase is ready — these are the outside steps only you can do.

---

## 1. Feedback collection (do this first — free, 5 minutes)

### Formspree (post-download feedback form)
- [ ] Go to formspree.io → Sign up with your Google account (free — 50 submissions/month)
- [ ] Click **+ New Form** → Name: **Bandhan Feedback** → set your email → Create
- [ ] Copy the Form ID (format: `xyzabcde` — 8 chars)
- [ ] Open `src/pages/BuilderPage.jsx` → find `FORMSPREE_ENDPOINT` (line ~815) → replace `XXXXXXXXXX` with your form ID
- [ ] Commit and push
- [ ] View all submissions at: `formspree.io/forms/[your-form-id]` (table view + CSV export)
- [ ] You will also receive an email for every new submission

> **What you'll capture:** star rating (1–5), template used, optional comment text.
> **Where to view in GA4:** Events → `feedback_submitted` → dimension breakdown by `rating` and `template`.

---

## 2. Analytics (do this first — start collecting data early)

### Google Analytics 4
- [ ] Go to analytics.google.com → Create account → Property: **Bandhan** → Platform: **Web** → URL: `bandhan.app`
- [ ] Copy the Measurement ID (format: `G-XXXXXXXXXX`)
- [ ] Open `index.html` → replace **both** occurrences of `G-XXXXXXXXXX` with your real ID
- [ ] Commit and push the change

### Microsoft Clarity (free session recordings + heatmaps)
- [ ] Go to clarity.microsoft.com → New project → Name: **Bandhan** → URL: `bandhan.app`
- [ ] Copy the Project ID (10-char string)
- [ ] Open `index.html` → replace `XXXXXXXXXX` in the Clarity block with your real ID
- [ ] Commit and push the change

---

## 2. Domain

- [ ] Purchase `bandhan.app` (check namecheap.com, google.com/domains, or godaddy.com)
- [ ] Keep the DNS management panel open — you'll need it in step 3

---

## 3. Hosting — Netlify

- [ ] Go to netlify.com → Add new site → Import from GitHub
- [ ] Select the repo: `palemabhineshreddy/rasaa-bio-data-maker`
- [ ] Build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Click Deploy
- [ ] Wait for first deploy to succeed (green tick)

### Connect custom domain
- [ ] In Netlify → Site settings → Domain management → Add custom domain → `bandhan.app`
- [ ] Netlify will show you 2 nameserver addresses (e.g. `dns1.p01.nsone.net`)
- [ ] In your domain registrar → point nameservers to Netlify's nameservers
- [ ] Wait for DNS propagation (usually 10–30 minutes, max 48 hours)
- [ ] Netlify auto-provisions HTTPS (Let's Encrypt) once DNS resolves — tick this off when padlock appears

---

## 4. Google Search Console

- [ ] Go to search.google.com/search-console → Add property → Domain: `bandhan.app`
- [ ] Verify via DNS TXT record (Netlify makes this easy — GSC gives you a TXT record, add it in Netlify DNS)
- [ ] After verification → Sitemaps → Add: `https://bandhan.app/sitemap.xml` → Submit
- [ ] URL Inspection → enter `https://bandhan.app/` → Request Indexing
- [ ] Check back in 3–5 days — should appear as Indexed

---

## 5. Post-deploy checks (do on launch day)

- [ ] Open `https://bandhan.app` in browser — site loads correctly
- [ ] Open in incognito — no login wall, no broken assets
- [ ] Test on mobile (Android + iPhone)
- [ ] Click "Create Your Biodata" → complete all 6 steps → download PDF → check PDF looks correct
- [ ] Share via WhatsApp on mobile — confirm PDF attaches (not just a link)
- [ ] Open GA4 → Realtime report → confirm your own visit shows up
- [ ] Open Clarity → confirm session recording appears within 2 hours
- [ ] Paste `https://bandhan.app` into WhatsApp → confirm OG image (biodata card preview) appears
- [ ] Paste into Twitter/X → confirm large image card appears
- [ ] Run Lighthouse audit: Chrome DevTools → Lighthouse → Mobile → confirm score (target: Performance 80+, SEO 95+)

---

## 6. After 1 month — Premium model

Review these in GA4 before deciding what to paywall:

| Metric to check | Decision it informs |
|---|---|
| `builder_started` ÷ total visits | Is CTA compelling enough? |
| Drop-off between steps | Which step to fix first |
| `template_selected` breakdown | Which templates are most popular (paywall candidates) |
| `pdf_downloaded` ÷ `preview_viewed` | Preview → download conversion |
| `whatsapp_shared` method breakdown | native vs link ratio (mobile vs desktop) |

### Payment integration (when ready)
- [ ] Create Razorpay account at razorpay.com (best for India — supports UPI, cards, netbanking)
- [ ] Decide what goes behind paywall (suggested: top 5 premium templates + white-label PDF)
- [ ] Add payment flow in BuilderPage before PDF download for premium templates
- [ ] Track `payment_initiated` and `payment_completed` events in `analytics.js`

---

## Quick reference — file locations for the two ID replacements

```
index.html  (lines ~14–28)

  <!-- Google Analytics 4 -->
  <script async src="...gtag/js?id=G-XXXXXXXXXX">   ← replace
  gtag('config', 'G-XXXXXXXXXX', {                   ← replace (same file, 2 places)

  <!-- Microsoft Clarity -->
  })(window, document, "clarity", "script", "XXXXXXXXXX");  ← replace
```
