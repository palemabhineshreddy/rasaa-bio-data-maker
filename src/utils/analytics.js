// Safe gtag wrapper — silent if GA is blocked by an ad blocker
function _gtag(...args) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag(...args)
    }
  } catch {}
}

export function trackEvent(name, params = {}) {
  _gtag('event', name, { app: 'bandhan', ...params })
}

// ─── Named events (full user journey) ─────────────────────────────────────

export const track = {
  // Landing page → builder hand-off
  builderStarted: (template = 'lotus') =>
    trackEvent('builder_started', { template }),

  // Each step displayed
  stepViewed: (stepIndex, stepName) =>
    trackEvent('step_viewed', { step_number: stepIndex + 1, step_name: stepName }),

  // User tapped Continue / advanced past a step
  stepCompleted: (stepIndex, stepName) =>
    trackEvent('step_completed', { step_number: stepIndex + 1, step_name: stepName }),

  // Template card clicked
  templateSelected: (templateId, templateName) =>
    trackEvent('template_selected', { template_id: templateId, template_name: templateName }),

  // Slogan language changed from dropdown
  sloganChanged: (language) =>
    trackEvent('slogan_changed', { language }),

  // Photo actions
  photoUploaded: () => trackEvent('photo_uploaded'),
  photoRemoved: () => trackEvent('photo_removed'),

  // ── Core conversion funnel ──────────────────────────────────────────────

  // Reached the final preview screen
  previewViewed: (template) =>
    trackEvent('preview_viewed', { template }),

  // PDF successfully downloaded — primary conversion
  pdfDownloaded: (template) =>
    trackEvent('pdf_downloaded', { template, value: 1 }),

  // WhatsApp share button clicked
  // method: 'native' (Web Share API with real PDF) | 'link' (wa.me fallback)
  whatsappShared: (method = 'link') =>
    trackEvent('whatsapp_shared', { method }),

  // ── Engagement signals ──────────────────────────────────────────────────

  // "Try sample" button — shows engagement intent
  sampleLoaded: () => trackEvent('sample_data_loaded'),

  // Custom field added — shows power-user behaviour
  customFieldAdded: (section) =>
    trackEvent('custom_field_added', { section }),
}
