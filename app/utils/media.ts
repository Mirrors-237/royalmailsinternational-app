// Website photos (Unsplash and Pexels), hosted in public/images (sources: public/images/CREDITS.md).
// Each one can be replaced in the admin (Settings → Photos); useMedia() returns the photo in use.
export const MEDIA = {
  hero:      { src: '/images/hero-air.webp',          alt: 'A jet at the gate at sunset' },
  air:       { src: '/images/air-freight.webp',       alt: 'A passenger jet at the gate at sunset' },
  sea:       { src: '/images/sea-freight.webp',       alt: 'A container ship being loaded by port cranes' },
  road:      { src: '/images/road-freight.webp',      alt: 'A lorry on a road lined with trees' },
  customs:   { src: '/images/customs-warehouse.webp', alt: 'Aisles of shelving stacked with boxes in a bonded warehouse' },
  port:      { src: '/images/port-aerial.webp',       alt: 'Aerial view of a container port' },
  sorting:   { src: '/images/sorting-centre.webp',    alt: 'Parcels on racks in a sorting centre' },
  receive:   { src: '/images/delivery-handover.webp', alt: 'A courier hands a parcel to a customer outside her home' },
  business:  { src: '/images/warehouse-team.webp',    alt: 'A team checking boxes in a warehouse' },
}

export type MediaSlot = keyof typeof MEDIA
export type SiteImage = { src: string; alt: string }

// Where each photo appears, shown in the admin next to the upload button
export const MEDIA_USAGE: Record<MediaSlot, string> = {
  hero:     'Top of the home page; tracking result page.',
  air:      'Air freight card and section; Get a quote page header.',
  sea:      'Sea freight card and section; Send page header; last band of the home page.',
  road:     'Road freight card and section; Receive and Track page headers.',
  customs:  'Customs clearance card and section; Help page header.',
  port:     '"Why ship with us" band on the home page; About page; final call-to-action bands.',
  sorting:  'Business and About page headers.',
  receive:  'Contact page header; last band of the Receive page.',
  business: 'Last band of the Business page.',
}

// Illustrations that can be replaced by a photo in the admin (Settings → Photos), and where each appears.
// The photo then fills the illustration's space everywhere it is used (components/IllustrationSpot.vue).
export const ILLUSTRATION_SPOTS = {
  send:      { label: 'Sending',        usage: 'Home page "Sending a parcel or freight?" card; Send page, "Preparing your shipment"; Get a quote page.' },
  receive:   { label: 'Receiving',      usage: 'Home page "Receiving a parcel?" card; top of the Receive page.' },
  business:  { label: 'Businesses',     usage: 'Home page "Shipping for a business?" card; top of the Business page.' },
  customs:   { label: 'Customs',        usage: 'Home page "Customs, explained" card; Receive page, "Customs duties and taxes".' },
  worldwide: { label: 'Worldwide',      usage: 'Home page "Where we deliver" card; top of the About page.' },
  support:   { label: 'Customer service', usage: 'Home page "Talk to a real person" card; Help page contact card; tracking result page.' },
  track:     { label: 'Tracking',       usage: 'Track page; tracking page when a number is not found.' },
  courier:   { label: 'Delivery',       usage: 'Receive page, "On delivery day".' },
} as const

export type ReplaceableIllustration = keyof typeof ILLUSTRATION_SPOTS

// Every image that can be uploaded in the admin (same names as MediaSlot in the API)
export type ImageSlot = MediaSlot | `illustration-${ReplaceableIllustration}` | `block-${BlockPlacement}`
