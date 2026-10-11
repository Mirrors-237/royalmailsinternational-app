// Public response of GET /shipments/track/:number (no personal data)
export type ShipmentStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'IN_CUSTOMS' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION'
export type CheckpointStatus = 'PICKED_UP' | 'DEPARTED' | 'ARRIVED' | 'IN_CUSTOMS' | 'CUSTOMS_CLEARED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION' | 'RETURNED'
export type TransportMode = 'AIR' | 'SEA' | 'ROAD' | 'MULTI'

export interface TrackingCheckpoint {
  status: CheckpointStatus
  statusLabel: string
  facility: string | null
  city: string
  country: string
  lat: number
  lng: number
  occurredAt: string
}

export interface PublicTracking {
  trackingNumber: string
  status: ShipmentStatus
  transportMode: TransportMode
  category: string
  weightKg: number | null
  origin: { city: string; country: string }
  destination: { city: string; country: string }
  estimatedDelivery: string | null
  createdAt: string
  updatedAt: string
  checkpoints: TrackingCheckpoint[]
}

// The five main stages shown in the progress bar
export const JOURNEY_STEPS = ['Collected', 'In transit', 'In customs', 'Out for delivery', 'Delivered'] as const

export const SHIPMENT_STATUS: Record<ShipmentStatus, { label: string; summary: string; icon: string; step: number }> = {
  PENDING:          { label: 'Shipment registered', summary: "The shipment has been created; the parcel hasn't been handed over to us yet.", icon: 'lucide:clock',            step: 0 },
  PICKED_UP:        { label: 'Collected',           summary: 'The parcel is with us and getting ready to leave.',                            icon: 'lucide:package-check',    step: 1 },
  IN_TRANSIT:       { label: 'In transit',          summary: 'The parcel is on its way to the destination country.',                          icon: 'lucide:send',             step: 2 },
  IN_CUSTOMS:       { label: 'In customs',          summary: 'Customs formalities are being processed.',                                      icon: 'lucide:landmark',         step: 3 },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',    summary: 'The parcel is on its way to the recipient.',                                    icon: 'lucide:truck',            step: 4 },
  DELIVERED:        { label: 'Delivered',           summary: 'The parcel has been delivered to the recipient.',                               icon: 'lucide:circle-check-big', step: 5 },
  EXCEPTION:        { label: 'Delayed',             summary: 'An issue is delaying your shipment. Our team is dealing with it.',             icon: 'lucide:triangle-alert',   step: -1 },
}

export const CHECKPOINT_ICON: Record<CheckpointStatus, string> = {
  PICKED_UP:        'lucide:package-check',
  DEPARTED:         'lucide:send',
  ARRIVED:          'lucide:map-pin-check',
  IN_CUSTOMS:       'lucide:landmark',
  CUSTOMS_CLEARED:  'lucide:shield-check',
  OUT_FOR_DELIVERY: 'lucide:truck',
  DELIVERED:        'lucide:circle-check-big',
  EXCEPTION:        'lucide:triangle-alert',
  RETURNED:         'lucide:undo-2',
}

// Stage reached by each event type (places a delayed shipment in the progress bar)
const CHECKPOINT_STEP: Record<CheckpointStatus, number> = {
  PICKED_UP: 1, DEPARTED: 2, ARRIVED: 2, IN_CUSTOMS: 3, CUSTOMS_CLEARED: 3,
  OUT_FOR_DELIVERY: 4, DELIVERED: 5, EXCEPTION: 0, RETURNED: 0,
}

export function journeyStep(t: PublicTracking) {
  const step = SHIPMENT_STATUS[t.status].step
  if (step >= 0) return step
  return Math.max(0, ...t.checkpoints.map((c) => CHECKPOINT_STEP[c.status]))
}

export const TRANSPORT_MODE: Record<TransportMode, { label: string; icon: string }> = {
  AIR:   { label: 'Air freight',   icon: 'lucide:plane' },
  SEA:   { label: 'Sea freight',   icon: 'lucide:ship' },
  ROAD:  { label: 'Road freight',  icon: 'lucide:truck' },
  MULTI: { label: 'Multimodal',    icon: 'lucide:layers' },
}

export const CATEGORY_LABEL: Record<string, string> = {
  DOCUMENT: 'Documents', PARCEL: 'Parcel', FREIGHT: 'Freight',
  FRAGILE: 'Fragile', PERISHABLE: 'Perishable', DANGEROUS: 'Dangerous goods',
}

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(LOCALE, { ...options, timeZone: TIME_ZONE })

export const formatDay  = (iso: string) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))
export const formatDate = (iso: string) => fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
export const formatTime = (iso: string) => fmt({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

// Grouping key for the timeline (one group per day)
export const dayKey = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TIME_ZONE }).format(new Date(iso))

// Date only (YYYY-MM-DD): read at midday so it never shifts to the previous day
export const formatDeliveryDay = (date: string) => formatDay(`${date.slice(0, 10)}T12:00:00Z`)
