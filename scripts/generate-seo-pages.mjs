// Post-build: writes dist/<slug>/index.html for every SEO page and appends them to dist/sitemap.xml.
// Each page is the built SPA shell with its own <title>, meta, canonical, JSON-LD and crawlable HTML.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { ALL_PAGES } from '../src/seo/pages.js'

const SITE = 'https://bandhan.app'
const DIST = new URL('../dist/', import.meta.url)
const shell = readFileSync(new URL('index.html', DIST), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

// Replace and fail loudly if the shell changed and a pattern no longer matches
function sub(html, re, replacement, label) {
  if (!re.test(html)) throw new Error(`generate-seo-pages: pattern not found in index.html: ${label}`)
  return html.replace(re, () => replacement)
}

function staticBody(p) {
  return `<main style="max-width:760px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif;line-height:1.6">
<h1>${esc(p.h1)}</h1>
<p>${esc(p.intro)}</p>
${p.fields?.length ? `<h2>What to include</h2><ul>${p.fields.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
${p.tips?.length ? `<h2>Tips</h2><ul>${p.tips.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
${p.faq?.length ? `<h2>FAQ</h2>${p.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` : ''}
<p><a href="/">Create your biodata free on Bandhan</a></p>
</main>`
}

function jsonLd(p, url) {
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Bandhan', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: p.h1, item: url },
      ],
    },
  ]
  if (p.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    })
  }
  return `<script type="application/ld+json">${jsonForScript({ '@context': 'https://schema.org', '@graph': graph })}</script>`
}

for (const p of ALL_PAGES) {
  const url = `${SITE}/${p.slug}/`
  let html = shell
  html = sub(html, /<html lang="[^"]*"/, `<html lang="${p.lang}"`, 'html lang')
  html = sub(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`, 'title')
  html = sub(html, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(p.description)}"`, 'description')
  html = sub(html, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`, 'canonical')
  html = sub(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(p.title)}"`, 'og:title')
  html = sub(html, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(p.description)}"`, 'og:description')
  html = sub(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`, 'og:url')
  html = sub(html, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(p.title)}"`, 'twitter:title')
  html = sub(html, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(p.description)}"`, 'twitter:description')
  // The shell's hreflang cluster describes the homepage languages, so drop it from topic pages
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*"\s+href="[^"]*"\s*\/>/g, '')
  html = sub(html, /<\/head>/, `${jsonLd(p, url)}<script>window.__SEO_PAGE__=${jsonForScript({ slug: p.slug, lang: p.lang, template: p.template })}</script></head>`, '</head>')
  html = sub(html, /<div id="root"><\/div>/, `<div id="root">${staticBody(p)}</div>`, 'root div')

  const dir = new URL(`${p.slug}/`, DIST)
  mkdirSync(dir, { recursive: true })
  writeFileSync(new URL('index.html', dir), html)
}

// Sitemap
const sitemapPath = new URL('sitemap.xml', DIST)
const today = new Date().toISOString().slice(0, 10)
const entries = ALL_PAGES.map((p) => `  <url>
    <loc>${SITE}/${p.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')
let sitemap = readFileSync(sitemapPath, 'utf8')
if (!sitemap.includes('</urlset>')) throw new Error('sitemap.xml has no </urlset>')
sitemap = sitemap.replace('</urlset>', `\n  <!-- Search landing pages (generated) -->\n${entries}\n</urlset>`)
writeFileSync(sitemapPath, sitemap)

console.log(`SEO pages generated: ${ALL_PAGES.length}`)
