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
