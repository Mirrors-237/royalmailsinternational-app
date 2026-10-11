// Home page content editable in the admin (Settings → Home page).
// The API stores it in site_settings.homeContent; null means these defaults.

export type SampleStatus = 'COLLECTED' | 'IN_TRANSIT' | 'IN_CUSTOMS' | 'DELIVERED'
export type SampleMode = 'AIR' | 'SEA' | 'ROAD'

// Example shipment shown in the animated tracking card at the top of the home page (illustration only)
export interface HomeSample {
  from: string
  via?: string
  to: string
  mode: SampleMode
  status: SampleStatus
}

export interface HomeContent {
  heroBadge: string
  heroTitle: string
  heroHighlight: string
  heroText: string
  stats: { value: string; label: string }[]
  samples: HomeSample[]
}

export const HOME_DEFAULTS: HomeContent = {
  heroBadge: 'Air, sea and road · 150+ countries',
  heroTitle: 'International shipping,',
  heroHighlight: 'made simple.',
  heroText: 'Air, sea and road freight to over 150 countries, customs clearance included, and tracking at every step.',
  stats: [
    { value: '150+', label: 'Countries served' },
    { value: '24 h', label: 'Quote reply' },
    { value: '3',    label: 'Transport modes' },
  ],
  samples: [
    { from: 'Paris, France',    via: 'Casablanca', to: "Abidjan, Côte d'Ivoire", mode: 'AIR',  status: 'IN_TRANSIT' },
    { from: 'Lyon, France',     via: 'Singapore',  to: 'Shanghai, China',        mode: 'SEA',  status: 'IN_CUSTOMS' },
    { from: 'Algiers, Algeria',                    to: 'Bordeaux, France',       mode: 'AIR',  status: 'DELIVERED' },
    { from: 'Madrid, Spain',    via: 'Algeciras',  to: 'Casablanca, Morocco',    mode: 'ROAD', status: 'COLLECTED' },
  ],
}

export const SAMPLE_STATUS: Record<SampleStatus, { label: string; icon: string; tone: string; progress: number; eta: string }> = {
  COLLECTED:  { label: 'Collected',  icon: 'lucide:package-check',    tone: 'border-violet-300/25 bg-violet-400/15 text-violet-200',   progress: 15,  eta: 'In 4 days' },
  IN_TRANSIT: { label: 'In transit', icon: 'lucide:send',             tone: 'border-sky-300/25 bg-sky-400/15 text-sky-200',            progress: 62,  eta: 'In 2 days' },
  IN_CUSTOMS: { label: 'In customs', icon: 'lucide:landmark',         tone: 'border-amber-300/25 bg-amber-400/15 text-amber-200',      progress: 82,  eta: 'Tomorrow' },
  DELIVERED:  { label: 'Delivered',  icon: 'lucide:circle-check-big', tone: 'border-emerald-300/25 bg-emerald-400/15 text-emerald-200', progress: 100, eta: 'Yesterday' },
}

export const SAMPLE_MODE: Record<SampleMode, { label: string; icon: string }> = {
  AIR:  { label: 'Air',  icon: 'lucide:plane' },
  SEA:  { label: 'Sea',  icon: 'lucide:ship' },
  ROAD: { label: 'Road', icon: 'lucide:truck' },
}

const city = (place: string) => place.split(',')[0]!.trim()

// Builds the four timeline rows shown in the card from the route and the status
export function sampleSteps(s: HomeSample) {
  const reached = (['COLLECTED', 'IN_TRANSIT', 'IN_CUSTOMS', 'DELIVERED'] as const).indexOf(s.status)
  return [
    `Collected in ${city(s.from)}`,
    s.via ? `Through ${city(s.via)}` : `Departed ${city(s.from)}`,
    `Customs in ${city(s.to)}`,
    `Delivered in ${city(s.to)}`,
  ].map((label, i) => ({ label, done: i <= reached }))
}

export function sampleNotice(s: HomeSample) {
  return {
    COLLECTED:  `Parcel collected in ${city(s.from)}`,
    IN_TRANSIT: `On its way to ${city(s.to)}`,
    IN_CUSTOMS: `Customs clearance in ${city(s.to)}`,
    DELIVERED:  `Delivered in ${city(s.to)}`,
  }[s.status]
}
