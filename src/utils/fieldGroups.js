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
