// The checkout stores the final phone number in E.164 form, e.g. +919876543210.
// Add a country here when the product expands into a new market.
export const countryDialingCodes = [
  { code: 'IN', name: 'India', dialCode: '+91', placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dialCode: '+1', placeholder: '201 555 0123' },
  { code: 'CA', name: 'Canada', dialCode: '+1', placeholder: '416 555 0123' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', placeholder: '7700 900123' },
  { code: 'AU', name: 'Australia', dialCode: '+61', placeholder: '412 345 678' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', placeholder: '50 123 4567' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', placeholder: '8123 4567' },
  { code: 'DE', name: 'Germany', dialCode: '+49', placeholder: '1512 3456789' },
  { code: 'FR', name: 'France', dialCode: '+33', placeholder: '6 12 34 56 78' },
  { code: 'IT', name: 'Italy', dialCode: '+39', placeholder: '312 345 6789' },
  { code: 'ES', name: 'Spain', dialCode: '+34', placeholder: '612 345 678' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', placeholder: '6 1234 5678' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', placeholder: '11 91234 5678' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', placeholder: '55 1234 5678' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', placeholder: '82 123 4567' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', placeholder: '802 123 4567' },
  { code: 'JP', name: 'Japan', dialCode: '+81', placeholder: '90 1234 5678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', placeholder: '10 1234 5678' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', placeholder: '812 3456 7890' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', placeholder: '917 123 4567' },
]

export function getCountryDialingCode(countryCode) {
  return countryDialingCodes.find((country) => country.code === countryCode) || countryDialingCodes[0]
}

export function toE164(countryCode, nationalNumber) {
  const country = getCountryDialingCode(countryCode)
  const digits = nationalNumber.replace(/\D/g, '')
  return `${country.dialCode}${digits}`
}
