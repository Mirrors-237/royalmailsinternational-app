<template>
  <div ref="mapEl" class="h-72 w-full rounded-xl bg-surface lg:h-80" role="img" :aria-label="label" />
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Shipment route: one point per event, joined in chronological order.
// Points are vector shapes (circleMarker): no marker images to load.
const props = defineProps<{ checkpoints: TrackingCheckpoint[]; label: string }>()

const el = useTemplateRef<HTMLElement>('mapEl')
let map: L.Map | undefined

// .client component: the template only renders after mounting, hence the nextTick
onMounted(async () => {
  await nextTick()
  if (!el.value) return
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1e3a5f'

  const points = [...props.checkpoints]
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
    .filter((cp) => Number.isFinite(cp.lat) && Number.isFinite(cp.lng))

  map = L.map(el.value, { scrollWheelZoom: false, attributionControl: true })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  if (!points.length) {
    map.setView([20, 0], 2)
    return
  }

  const latlngs = points.map((cp) => L.latLng(cp.lat, cp.lng))
  L.polyline(latlngs, { color: brand, weight: 3, opacity: 0.8, dashArray: '6 6' }).addTo(map)

  points.forEach((cp, i) => {
    const latest = i === points.length - 1
    L.circleMarker([cp.lat, cp.lng], {
      radius: latest ? 9 : 6,
      color: latest ? '#fff' : brand,
      weight: latest ? 3 : 2,
      fillColor: brand,
      fillOpacity: latest ? 1 : 0.35,
    })
      .bindTooltip(`${cp.city}: ${cp.statusLabel}`)
      .addTo(map!)
  })

  map.fitBounds(L.latLngBounds(latlngs), { padding: [36, 36], maxZoom: 9 })
})

onBeforeUnmount(() => map?.remove())
</script>
