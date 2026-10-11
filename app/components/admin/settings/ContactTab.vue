<template>
  <form class="card space-y-6 p-6" novalidate @submit.prevent="submit">
    <div>
      <h2 class="text-xl">Contact details</h2>
      <p class="mt-1 text-steel">Shown in the header, the footer, the Contact and About pages and the legal notice. Leave a field empty to hide it.</p>
    </div>
    <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

    <div class="grid gap-5 lg:grid-cols-2">
      <FormField id="phone" label="Phone number" optional>
        <template #default="{ field }"><input v-bind="field" v-model.trim="form.phone" type="tel" maxlength="40"></template>
      </FormField>
      <FormField id="email" label="Email address" optional>
        <template #default="{ field }"><input v-bind="field" v-model.trim="form.email" type="email" maxlength="254"></template>
      </FormField>
      <FormField id="whatsapp" label="WhatsApp number" optional>
        <template #default="{ field }"><input v-bind="field" v-model.trim="form.whatsapp" type="tel" maxlength="40"></template>
      </FormField>
      <FormField id="openingHours" label="Opening hours" hint="For example: Mon–Fri, 8am–6pm" optional>
        <template #default="{ field }"><input v-bind="field" v-model.trim="form.openingHours" maxlength="200"></template>
      </FormField>
    </div>

    <fieldset class="border-t border-line pt-6">
      <legend class="float-left w-full text-lg font-extrabold tracking-tight">Address</legend>
      <div class="clear-both grid gap-5 pt-4 lg:grid-cols-4">
        <FormField id="address" label="Street address" optional class="lg:col-span-4">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.address" maxlength="200" autocomplete="street-address"></template>
        </FormField>
        <FormField id="postalCode" label="Postcode" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.postalCode" maxlength="20"></template>
        </FormField>
        <FormField id="city" label="Town or city" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.city" maxlength="100"></template>
        </FormField>
        <FormField id="country" label="Country" optional class="lg:col-span-2">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.country" maxlength="100"></template>
        </FormField>
        <FormField id="mapEmbedUrl" label="Map link" hint="Google Maps: Share → Embed a map → copy only the address in src=&quot;…&quot; (starts with https://)." optional class="lg:col-span-4">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.mapEmbedUrl" type="url" placeholder="https://"></template>
        </FormField>
      </div>
    </fieldset>

    <fieldset class="border-t border-line pt-6">
      <legend class="float-left w-full text-lg font-extrabold tracking-tight">Social media</legend>
      <div class="clear-both grid gap-5 pt-4 lg:grid-cols-3">
        <FormField v-for="s in socials" :id="s.key" :key="s.key" :label="s.label" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form[s.key]" type="url" placeholder="https://"></template>
        </FormField>
      </div>
    </fieldset>

    <button type="submit" class="btn btn-brand" :disabled="busy">Save contact details</button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => emit('saved', s))

const keys = ['phone', 'email', 'whatsapp', 'openingHours', 'address', 'postalCode', 'city', 'country', 'mapEmbedUrl', 'socialFacebook', 'socialLinkedin', 'socialTwitter'] as const
const form = reactive(Object.fromEntries(keys.map((k) => [k, props.settings[k] ?? ''])) as Record<typeof keys[number], string>)

const socials = [
  { key: 'socialFacebook' as const, label: 'Facebook page' },
  { key: 'socialLinkedin' as const, label: 'LinkedIn page' },
  { key: 'socialTwitter' as const,  label: 'X (Twitter) profile' },
]

function submit() {
  const bad = (['mapEmbedUrl', 'socialFacebook', 'socialLinkedin', 'socialTwitter'] as const).find((k) => form[k] && !form[k].startsWith('https://'))
  if (bad) { error.value = 'Links must start with https://'; return }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { error.value = 'Enter a valid email address.'; return }
  save({ ...form })
}
</script>
