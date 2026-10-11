// Editorial content shared by several pages (home, Send, Receive, Business).
// Claims such as timescales, coverage or insurance must match the services you actually offer.

export interface ShippingService {
  id: 'air' | 'sea' | 'road' | 'customs'
  icon: string
  title: string
  summary: string
  detail: string
  description: string
  bestFor: string[]
}

export const SHIPPING_SERVICES: ShippingService[] = [
  {
    id: 'air',
    icon: 'lucide:plane',
    title: 'Air freight',
    summary: 'The fastest option, for urgent shipments.',
    detail: '24 to 72 hours',
    description: 'Your shipment flies on the next available connection and is handed to our local partner on arrival for customs clearance and delivery.',
    bestFor: ['Urgent documents and parcels', 'High-value or time-sensitive goods', 'Samples and spare parts'],
  },
  {
    id: 'sea',
    icon: 'lucide:ship',
    title: 'Sea freight',
    summary: 'The most economical option for large volumes.',
    detail: 'Large volumes',
    description: 'Full container or groupage: we book space, handle loading at the port and follow your goods until they reach their destination.',
    bestFor: ['Pallets and heavy goods', 'Regular stock replenishment', 'Moves and bulky items'],
  },
  {
    id: 'road',
    icon: 'lucide:truck',
    title: 'Road freight',
    summary: 'A network covering Europe and Africa.',
    detail: 'Europe and Africa',
    description: 'Door-to-door delivery by road, on dedicated or shared loads, with tracking at every hub along the way.',
    bestFor: ['Cross-border deliveries within a continent', 'Pallets and part loads', 'Pick-ups from suppliers'],
  },
  {
    id: 'customs',
    icon: 'lucide:landmark',
    title: 'Customs clearance',
    summary: 'We prepare and submit your customs paperwork.',
    detail: 'With every service',
    description: 'Commodity codes, declarations and duty calculations: we prepare the paperwork so your goods are not held at the border.',
    bestFor: ['Shipments outside your customs area', 'First-time exporters', 'Regulated or restricted goods'],
  },
]

export const PREPARE_TIPS = [
  { icon: 'lucide:package',   title: 'Strong packaging',      text: 'Use a sturdy box, wedge the contents and leave no empty space: the parcel has to withstand handling.' },
  { icon: 'lucide:file-text', title: 'The right documents',   text: 'For shipments leaving your customs area, include an invoice describing the contents and their value.' },
  { icon: 'lucide:map-pin',   title: 'A complete address',    text: "The recipient's full name, exact address and phone number prevent most returns." },
]

export const RECEIVE_STEPS = [
  { title: 'Track your parcel',        text: 'Ask the sender for the tracking number and enter it on our website.' },
  { title: 'Be ready for customs',     text: 'International shipments may be subject to duties and taxes. We let you know if a document is missing.' },
  { title: 'Take delivery',            text: 'Make sure the sender has your full address and a phone number you can be reached on.' },
]

export const BUSINESS_BENEFITS = [
  'Quote within 24 hours',
  'Insurance on every shipment',
  'Over 150 countries covered',
  'A team you can reach',
]

// Icon tile colours for each service
export const SERVICE_TONE: Record<ShippingService['id'], string> = {
  air:     'bg-sky-50 text-sky-700',
  sea:     'bg-teal-50 text-teal-700',
  road:    'bg-orange-50 text-orange-700',
  customs: 'bg-violet-50 text-violet-700',
}

// Anchor of a FAQ question on the Help page (/help#…)
export const faqSlug = (question: string) =>
  question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
