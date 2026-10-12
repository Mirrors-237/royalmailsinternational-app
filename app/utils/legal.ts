// Legal notice and privacy notice details edited in the admin (Brand and content → Legal pages)
export const LEGAL_LABELS = {
  legalForm:            'Legal form and share capital',
  registrationNumber:   'Registration number',
  vatNumber:            'VAT number',
  publicationDirector:  'Publication director',
  hostingProvider:      'Hosting provider',
  dataRetention:        'How long data is kept',
  dataProcessors:       'Service providers and transfers',
  supervisoryAuthority: 'Data protection authority',
} as const

export type LegalField = keyof typeof LEGAL_LABELS
export const LEGAL_FIELDS = Object.keys(LEGAL_LABELS) as LegalField[]

// Items still empty: they are left out of the pages, so the admin points them out
export function missingLegalFields(settings: Pick<SiteSettings, LegalField>) {
  return LEGAL_FIELDS.filter((k) => !settings[k]?.trim())
}
