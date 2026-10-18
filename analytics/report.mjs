// Bandhan GA4 funnel + audience report → analytics/out/report.html
// Env: GA4_PROPERTY_ID (numeric), GOOGLE_APPLICATION_CREDENTIALS (service-account key path)
// Usage: node report.mjs [days=28]
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { mkdirSync, writeFileSync } from 'node:fs'

const PROPERTY = process.env.GA4_PROPERTY_ID
if (!PROPERTY) { console.error('Set GA4_PROPERTY_ID'); process.exit(1) }
const DAYS = Number(process.argv[2]) || 28
const client = new BetaAnalyticsDataClient()
const property = `properties/${PROPERTY}`

const range = (s, e) => [{ startDate: s, endDate: e }]
const cur = range(`${DAYS}daysAgo`, 'yesterday')
const prev = range(`${DAYS * 2}daysAgo`, `${DAYS + 1}daysAgo`)

async function run(dimensions, metrics, dateRanges = cur, extra = {}) {
  const [res] = await client.runReport({
    property, dateRanges,
    dimensions: dimensions.map(name => ({ name })),
    metrics: metrics.map(name => ({ name })),
    limit: 25, ...extra,
  })
  return res.rows.map(r => [...r.dimensionValues.map(v => v.value), ...r.metricValues.map(v => Number(v.value))])
}

// Unique users per funnel event
const FUNNEL = [
  ['Visited site', 'landing_viewed'],
  ['Clicked Create', 'builder_started'],
  ['Viewed preview', 'preview_viewed'],
  ['Downloaded PDF', 'pdf_downloaded'],
  ['Left feedback', 'feedback_submitted'],
]
async function eventUsers(ranges) {
  const rows = await run(['eventName'], ['totalUsers', 'eventCount'], ranges, { limit: 100 })
  const m = Object.fromEntries(rows.map(([n, u, c]) => [n, { users: u, count: c }]))
  return m
}

const [ev, evPrev] = await Promise.all([eventUsers(cur), eventUsers(prev)])
const steps = await run(['customEvent:step_number', 'eventName'], ['totalUsers'], cur, {
  dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['step_viewed', 'step_completed'] } } },
  orderBys: [{ dimension: { dimensionName: 'customEvent:step_number' } }],
}).catch(() => null) // null if step_number not yet registered as a custom dimension

const [countries, cities, devices, sources, langs, templates, newVsRet, daily, failures] = await Promise.all([
  run(['country'], ['totalUsers', 'sessions']),
  run(['city'], ['totalUsers']),
  run(['deviceCategory'], ['totalUsers', 'engagementRate']),
  run(['sessionSourceMedium'], ['totalUsers', 'sessions', 'engagementRate']),
  run(['language'], ['totalUsers']),
  run(['customEvent:template'], ['eventCount'], cur, {
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'pdf_downloaded' } } },
  }).catch(() => null),
  run(['newVsReturning'], ['totalUsers']),
  run(['date'], ['totalUsers', 'sessions'], cur, { limit: 100, orderBys: [{ dimension: { dimensionName: 'date' } }] }),
  run(['customEvent:error_message'], ['eventCount'], cur, {
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'pdf_download_failed' } } },
  }).catch(() => null),
])

// ── render ──
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : '–')
const delta = (a, b) => (b ? ((a - b) / b * 100).toFixed(0) + '%' : 'new')
const table = (head, rows, fmt = v => v) =>
  rows ? `<table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${esc(typeof c === 'number' ? fmt(c) : c)}</td>`).join('')}</tr>`).join('')}</table>`
       : '<p class="warn">Not available — register this parameter as a custom dimension in GA4 (Admin → Custom definitions).</p>'

const top = ev[FUNNEL[0][1]]?.users || 0
const funnelRows = FUNNEL.map(([label, name], i) => {
  const u = ev[name]?.users || 0, p = evPrev[name]?.users || 0
  const prevStep = i ? (ev[FUNNEL[i - 1][1]]?.users || 0) : 0
  return `<tr><td>${label}</td><td>${u}</td><td>${pct(u, top)}</td><td>${i ? pct(u, prevStep) : '–'}</td><td>${delta(u, p)}</td>
  <td><div class="bar" style="width:${top ? 100 * u / top : 0}%"></div></td></tr>`
}).join('')

let stepHtml = '<p class="warn">Register <code>step_number</code> as a custom dimension to see per-step drop-off.</p>'
if (steps) {
  const by = {}
  for (const [n, e, u] of steps) (by[n] ??= {})[e] = u
  stepHtml = `<table><tr><th>Step</th><th>Viewed</th><th>Completed</th><th>Drop-off</th></tr>${Object.entries(by).map(([n, o]) => {
    const v = o.step_viewed || 0, c = o.step_completed || 0
    return `<tr><td>${n}</td><td>${v}</td><td>${c}</td><td>${v ? ((1 - c / v) * 100).toFixed(0) + '%' : '–'}</td></tr>`
  }).join('')}</table>`
}

const html = `<!doctype html><meta charset="utf-8"><title>Bandhan analytics</title>
<style>body{font:15px system-ui;max-width:900px;margin:32px auto;padding:0 16px;color:#111}
h1{margin-bottom:0}h2{margin-top:36px}table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:6px 10px;border-bottom:1px solid #e5e5e5}th{font-size:12px;text-transform:uppercase;color:#666}
.bar{height:10px;background:#0a0a0a;border-radius:3px}.warn{color:#b45309}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:700px){.grid{grid-template-columns:1fr}}</style>
<h1>Bandhan analytics</h1><p>Last ${DAYS} days (vs previous ${DAYS}) · generated ${new Date().toISOString().slice(0, 16)}Z</p>
<h2>Conversion funnel (unique users)</h2>
<table><tr><th>Stage</th><th>Users</th><th>% of visitors</th><th>% of prev stage</th><th>vs prev period</th><th></th></tr>${funnelRows}</table>
<h2>Builder step drop-off</h2>${stepHtml}
<h2>PDF downloads by template</h2>${table(['Template', 'Downloads'], templates)}
<h2>PDF failures</h2>${table(['Error', 'Count'], failures)}
<div class="grid"><div><h2>Countries</h2>${table(['Country', 'Users', 'Sessions'], countries)}</div>
<div><h2>Cities</h2>${table(['City', 'Users'], cities)}</div>
<div><h2>Traffic sources</h2>${table(['Source / medium', 'Users', 'Sessions', 'Engaged'], sources, v => v % 1 ? (v * 100).toFixed(0) + '%' : v)}</div>
<div><h2>Devices</h2>${table(['Device', 'Users', 'Engaged'], devices, v => v % 1 ? (v * 100).toFixed(0) + '%' : v)}</div>
<div><h2>Browser language</h2>${table(['Language', 'Users'], langs)}</div>
<div><h2>New vs returning</h2>${table(['Type', 'Users'], newVsRet)}</div></div>
<h2>Daily users</h2>${table(['Date', 'Users', 'Sessions'], daily)}`

mkdirSync(new URL('./out/', import.meta.url), { recursive: true })
writeFileSync(new URL('./out/report.html', import.meta.url), html)
console.log('Wrote analytics/out/report.html')
