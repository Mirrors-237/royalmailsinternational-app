// Public response of GET /shipments/track/:number (no personal data)
export type ShipmentStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'IN_CUSTOMS' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION'
export type CheckpointStatus = 'PICKED_UP' | 'DEPARTED' | 'IN_TRANSIT' | 'ARRIVED' | 'IN_CUSTOMS' | 'CUSTOMS_CLEARED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION' | 'RETURNED' | 'CUSTOM'
export type TransportMode = 'AIR' | 'SEA' | 'ROAD' | 'MULTI'

export interface TrackingCheckpoint {
  status: CheckpointStatus
  statusLabel: string
  customName: string | null // CUSTOM events: name chosen in the admin
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

export const SHIPMENT_STATUS: Record<ShipmentStatus, { label: string; summary: string; icon: string }> = {
  PENDING:          { label: 'Shipment registered', summary: "The shipment has been created; the parcel hasn't been handed over to us yet.", icon: 'lucide:clock' },
  PICKED_UP:        { label: 'Collected',           summary: 'The parcel is with us and getting ready to leave.',                            icon: 'lucide:package-check' },
  IN_TRANSIT:       { label: 'In transit',          summary: 'The parcel is on its way to the destination country.',                          icon: 'lucide:send' },
  IN_CUSTOMS:       { label: 'In customs',          summary: 'Customs formalities are being processed.',                                      icon: 'lucide:landmark' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',    summary: 'The parcel is on its way to the recipient.',                                    icon: 'lucide:truck' },
  DELIVERED:        { label: 'Delivered',           summary: 'The parcel has been delivered to the recipient.',                               icon: 'lucide:circle-check-big' },
  EXCEPTION:        { label: 'Delayed',             summary: 'An issue is delaying your shipment. Our team is dealing with it.',             icon: 'lucide:triangle-alert' },
}

export const CHECKPOINT_ICON: Record<CheckpointStatus, string> = {
  PICKED_UP:        'lucide:package-check',
  DEPARTED:         'lucide:send',
  IN_TRANSIT:       'lucide:route',
  ARRIVED:          'lucide:map-pin-check',
  IN_CUSTOMS:       'lucide:landmark',
  CUSTOMS_CLEARED:  'lucide:shield-check',
  OUT_FOR_DELIVERY: 'lucide:truck',
  DELIVERED:        'lucide:circle-check-big',
  EXCEPTION:        'lucide:triangle-alert',
  RETURNED:         'lucide:undo-2',
  CUSTOM:           'lucide:circle-dot',
}

// Short name of each event type, shown under its point in the progress bar
export const CHECKPOINT_LABEL: Record<CheckpointStatus, string> = {
  PICKED_UP:        'Collected',
  DEPARTED:         'Departed',
  IN_TRANSIT:       'In transit',
  ARRIVED:          'Arrived',
  IN_CUSTOMS:       'In customs',
  CUSTOMS_CLEARED:  'Customs cleared',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED:        'Delivered',
  EXCEPTION:        'Delayed',
  RETURNED:         'Returned to sender',
  CUSTOM:           'Update',
}

// Name of a step: the one chosen in the admin for a custom event, otherwise the name of its type
export const checkpointName = (cp: { status: CheckpointStatus; customName?: string | null }) =>
  (cp.status === 'CUSTOM' && cp.customName) || CHECKPOINT_LABEL[cp.status]

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
export const formatShortDay = (iso: string) => fmt({ day: 'numeric', month: 'short' }).format(new Date(iso))
export const formatTime = (iso: string) => fmt({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

// Grouping key for the timeline (one group per day)
export const dayKey = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TIME_ZONE }).format(new Date(iso))

// Date only (YYYY-MM-DD): read at midday so it never shifts to the previous day
export const formatDeliveryDay = (date: string) => formatDay(`${date.slice(0, 10)}T12:00:00Z`)
