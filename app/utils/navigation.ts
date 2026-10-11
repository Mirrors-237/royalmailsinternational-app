export interface NavLink {
  to: string
  label: string
}

// Main sections, organised by what the visitor wants to do
export const MAIN_NAV: NavLink[] = [
  { to: '/send',     label: 'Send' },
  { to: '/receive',  label: 'Receive' },
  { to: '/track',    label: 'Track' },
  { to: '/business', label: 'Business' },
  { to: '/help',     label: 'Help' },
]

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: 'Send',
    links: [
      { to: '/send',  label: 'Shipping options' },
      { to: '/quote', label: 'Get a quote' },
    ],
  },
  {
    title: 'Receive',
    links: [
      { to: '/track',   label: 'Track a parcel' },
      { to: '/receive', label: 'Receiving a parcel' },
    ],
  },
  {
    title: 'Business',
    links: [
      { to: '/business', label: 'Business solutions' },
      { to: '/quote',    label: 'Tailored quote' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/help',    label: 'FAQs' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
]

export const LEGAL_NAV: NavLink[] = [
  { to: '/about',   label: 'About us' },
  { to: '/legal',   label: 'Legal notice' },
  { to: '/privacy', label: 'Privacy' },
]
