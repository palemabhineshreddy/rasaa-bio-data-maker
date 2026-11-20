// Safe gtag wrapper — silent if GA is blocked by an ad blocker
function _gtag(...args) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag(...args)
    }
  } catch {}
}

// UI language, kept in sync by LanguageContext so every event can be split by language.
// Sent as `ui_language`: GA4 reserves `language` (browser language) and drops a custom param of that name.
let _lang = 'en'
export function setAnalyticsLang(code) { _lang = code }

// Microsoft Clarity: tag recordings so sessions can be filtered (e.g. "left on step 1") and watched
function _clarity(...args) {
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') window.clarity(...args)
  } catch {}
}

export function trackEvent(name, params = {}) {
  _gtag('event', name, { app: 'bandhan', ui_language: _lang, ...params })
}

// ─── Named events (full user journey) ─────────────────────────────────────

export const track = {
  // Landing page shown (once per session) — denominator for landing → Create conversion
  landingViewed: () => trackEvent('landing_viewed'),

  // UI language switched via the globe dropdown
  languageChanged: (language) => trackEvent('language_changed', { to_language: language }),

  // Continue pressed with a required field still empty (nothing blocks it, but it hurts the output)
  requiredFieldEmpty: (stepIndex, field) =>
    trackEvent('required_field_empty', { step_number: stepIndex + 1, field }),

  // Builder left before reaching the preview — last_step shows where people give up
  builderExited: (stepIndex, hasName) => {
    trackEvent('builder_exited', { last_step: stepIndex + 1, has_name: hasName })
    _clarity('event', `builder_exit_step_${stepIndex + 1}`)
    _clarity('set', 'exit_step', String(stepIndex + 1))
  },

  // "What stopped you?" answer after leaving the builder early (reason is a fixed key, never free text)
  exitReason: (reason, lastStep) => {
    trackEvent('exit_reason', { reason, last_step: lastStep })
    _clarity('event', `exit_reason_${reason}`)
    _clarity('set', 'exit_reason', reason)
  },

  // "See a sample biodata" opened on step 1
  sampleViewed: (template) => trackEvent('sample_viewed', { template }),

  // Landing page → builder hand-off
  builderStarted: (template = 'lotus') => {
    trackEvent('builder_started', { template })
    _clarity('event', 'builder_started')
  },

  // Each step displayed
  stepViewed: (stepIndex, stepName) =>
    trackEvent('step_viewed', { step_number: stepIndex + 1, step_name: stepName }),

  // User tapped Continue / advanced past a step
  stepCompleted: (stepIndex, stepName) =>
    trackEvent('step_completed', { step_number: stepIndex + 1, step_name: stepName }),

  // Template card clicked
  templateSelected: (templateId, templateName) =>
    trackEvent('template_selected', { template: templateId, template_name: templateName }),

  // Slogan language changed from dropdown
  sloganChanged: (language) =>
    trackEvent('slogan_changed', { language }),

  // Photo actions
  photoUploaded: () => trackEvent('photo_uploaded'),
  photoRemoved: () => trackEvent('photo_removed'),

  // Floating preview button tapped (mobile only — no side-panel preview at that width)
  mobilePreviewOpened: (stepIndex) =>
    trackEvent('mobile_preview_opened', { step_number: stepIndex + 1 }),

  // ── Core conversion funnel ──────────────────────────────────────────────

  // Reached the final preview screen
  previewViewed: (template) =>
    trackEvent('preview_viewed', { template }),

  // PDF successfully downloaded — primary conversion
  pdfDownloaded: (template) =>
    trackEvent('pdf_downloaded', { template, value: 1 }),

  // PDF generation/download threw — lets us see failures GA previously couldn't distinguish from abandonment
  pdfDownloadFailed: (template, message) =>
    trackEvent('pdf_download_failed', { template, error_message: String(message).slice(0, 100) }),

  // WhatsApp share button clicked
  // method: 'native' (Web Share API with real PDF) | 'link' (wa.me fallback)
  whatsappShared: (method = 'link') =>
    trackEvent('whatsapp_shared', { method }),

  // ── Engagement signals ──────────────────────────────────────────────────

  // Custom field added — shows power-user behaviour
  customFieldAdded: (section) =>
    trackEvent('custom_field_added', { section }),

  // Post-download feedback: rating 1–5, template, whether they left a comment
  feedbackSubmitted: (rating, template, hasComment = false) =>
    trackEvent('feedback_submitted', { rating, template, has_comment: hasComment }),
}
