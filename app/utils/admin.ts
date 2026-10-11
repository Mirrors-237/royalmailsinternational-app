// Labels and colours used by the administration screens

export const SHIPMENT_TONE: Record<ShipmentStatus, string> = {
  PENDING:          'bg-slate-100 text-slate-700',
  PICKED_UP:        'bg-violet-50 text-violet-700',
  IN_TRANSIT:       'bg-sky-50 text-sky-700',
  IN_CUSTOMS:       'bg-amber-50 text-amber-800',
  OUT_FOR_DELIVERY: 'bg-indigo-50 text-indigo-700',
  DELIVERED:        'bg-emerald-50 text-emerald-700',
  EXCEPTION:        'bg-red-50 text-red-700',
}

// Default wording of each tracking event, proposed when an event is added (it can be changed)
export const CHECKPOINT_TYPE: Record<CheckpointStatus, { label: string; example: (city: string) => string }> = {
  PICKED_UP:        { label: 'Collected',          example: (c) => `Parcel collected in ${c}` },
  DEPARTED:         { label: 'Departed',           example: (c) => `Departed ${c}` },
  ARRIVED:          { label: 'Arrived',            example: (c) => `Arrived in ${c}` },
  IN_CUSTOMS:       { label: 'In customs',         example: (c) => `Customs clearance in progress in ${c}` },
  CUSTOMS_CLEARED:  { label: 'Customs cleared',    example: (c) => `Cleared customs in ${c}` },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',   example: (c) => `Out for delivery in ${c}` },
  DELIVERED:        { label: 'Delivered',          example: (c) => `Delivered in ${c}` },
  EXCEPTION:        { label: 'Delay or incident',  example: (c) => `Delayed in ${c}` },
  RETURNED:         { label: 'Returned to sender', example: (c) => `Returned to sender from ${c}` },
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST'
export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: string }> = {
  NEW:       { label: 'New',       tone: 'bg-sky-50 text-sky-700' },
  CONTACTED: { label: 'Contacted', tone: 'bg-violet-50 text-violet-700' },
  QUOTED:    { label: 'Quoted',    tone: 'bg-amber-50 text-amber-800' },
  CONVERTED: { label: 'Won',       tone: 'bg-emerald-50 text-emerald-700' },
  LOST:      { label: 'Lost',      tone: 'bg-slate-100 text-slate-600' },
}

export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED'
export const MESSAGE_STATUS: Record<MessageStatus, { label: string; tone: string }> = {
  UNREAD:  { label: 'Unread',  tone: 'bg-sky-50 text-sky-700' },
  READ:    { label: 'Read',    tone: 'bg-slate-100 text-slate-600' },
  REPLIED: { label: 'Replied', tone: 'bg-emerald-50 text-emerald-700' },
}

const dateTime = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE })
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))

export interface Paged<T> { items: T[]; total: number; page: number; limit: number }

export interface AdminCheckpoint {
  id: string; status: CheckpointStatus; statusLabel: string; facility: string | null
  city: string; country: string; lat: string; lng: string; occurredAt: string
}

export interface AdminShipment {
  id: string; trackingNumber: string; status: ShipmentStatus; transportMode: TransportMode; category: string
  senderName: string; senderEmail: string; senderPhone: string; senderAddress: string; senderCity: string; senderCountry: string
  receiverName: string; receiverEmail: string; receiverPhone: string; receiverAddress: string; receiverCity: string; receiverCountry: string
  weightKg: string; lengthCm: string | null; widthCm: string | null; heightCm: string | null
  description: string | null; estimatedDelivery: string | null; declaredValue: string | null; currency: string | null
  isInsured: boolean; notes: string | null; createdAt: string; updatedAt: string
  checkpoints?: AdminCheckpoint[]
}

export interface AdminLead {
  id: string; fullName: string; email: string; phone: string; company: string | null
  originCity: string; originCountry: string; destinationCity: string; destinationCountry: string
  weightKg: string; lengthCm: string | null; widthCm: string | null; heightCm: string | null
  transportMode: string | null; category: string | null; message: string | null
  status: LeadStatus; adminNotes: string | null; createdAt: string
}

export interface AdminMessage {
  id: string; fullName: string; email: string; phone: string | null; subject: string; message: string
  status: MessageStatus; createdAt: string
}
