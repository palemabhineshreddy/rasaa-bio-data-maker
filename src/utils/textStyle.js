// Text size and letter case chosen on the Preview step. They apply to biodata rows only
// (label, colon, value); headings and the name banner keep the template's own sizes.

export const TEXT_SIZES = ['xs', 's', 'm', 'l', 'xl']
const SCALE = { xs: 0.85, s: 0.92, m: 1, l: 1.12, xl: 1.25 }

export const textScale = data => SCALE[data?.textSize] ?? 1

// Email and the About / Partner paragraphs stay in normal case even in ALL CAPITALS mode
export const capsStyle = (data, keepCase) =>
  data?.textCase === 'upper' && !keepCase ? 'uppercase' : undefined
