// Each ID maps 1-to-1 to a formData field key.
// One drag handle per field in the form; one Row per field in the PDF.

export const DEFAULT_FIELD_ORDER = {
  personal:  ['fullName', 'gender', 'dateOfBirth', 'age', 'height', 'weight', 'bloodGroup', 'religion', 'caste', 'subCaste', 'motherTongue'],
  horoscope: ['rashi', 'nakshatra', 'gotra', 'manglik'],
  career:    ['education', 'college', 'occupation', 'company', 'income', 'workLocation'],
  family:    ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'brothers', 'sisters', 'familyType', 'familyStatus', 'nativePlace'],
  contact:   ['phone', 'email', 'city', 'state', 'address'],
}

export function getFieldOrder(formData, section) {
  return formData?.fieldOrder?.[section] ?? DEFAULT_FIELD_ORDER[section]
}

// Fields the user added appear in the order as 'cf:<id>' so they can sit anywhere in a section.
export const customFieldKey = f => `cf:${f.id}`

// A section's order including added fields: new ones go at the end, deleted ones drop out.
export function getSectionOrder(formData, section) {
  const order = getFieldOrder(formData, section)
  const added = (formData?.customFields || []).filter(f => f.section === section).map(customFieldKey)
  return [
    ...order.filter(id => !id.startsWith('cf:') || added.includes(id)),
    ...added.filter(id => !order.includes(id)),
  ]
}
