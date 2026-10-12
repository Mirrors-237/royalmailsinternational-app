<template>
  <form class="space-y-6" novalidate @submit.prevent="save({ ...form }, 'Legal information saved')">
    <div v-if="missing.length" class="flex items-start gap-3 rounded-2xl bg-amber-50 p-5 text-amber-900" role="status">
      <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p class="font-bold">{{ missing.length === 1 ? '1 item is' : `${missing.length} items are` }} still empty</p>
        <p class="mt-1 text-sm">
          Empty items are left out of the website pages, but the law may require them: {{ missing.join(', ') }}.
        </p>
      </div>
    </div>
    <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

    <section class="card p-6" aria-labelledby="legal-notice">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="legal-notice" class="text-xl">Legal notice</h2>
          <p class="mt-1 text-steel">Who publishes and hosts the website. The company name, address and contact details come from the other tabs.</p>
        </div>
        <NuxtLink to="/legal" target="_blank" class="link-arrow text-sm">View the page <Icon name="lucide:external-link" class="size-4" aria-hidden="true" /></NuxtLink>
      </div>
      <div class="mt-5 grid gap-5 lg:grid-cols-2">
        <FormField id="legalForm" :label="LABELS.legalForm" optional class="lg:col-span-2">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.legalForm" maxlength="160" placeholder="e.g. Private limited company with a share capital of £10,000"></template>
        </FormField>
        <FormField id="registrationNumber" :label="LABELS.registrationNumber" hint="Company number, SIREN or equivalent, with the register." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.registrationNumber" maxlength="80" placeholder="e.g. 12345678 (Companies House)"></template>
        </FormField>
        <FormField id="vatNumber" :label="LABELS.vatNumber" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.vatNumber" maxlength="40" placeholder="e.g. GB123456789"></template>
        </FormField>
        <FormField id="publicationDirector" :label="LABELS.publicationDirector" hint="The person responsible for what the website publishes." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.publicationDirector" maxlength="120"></template>
        </FormField>
        <FormField id="hostingProvider" :label="LABELS.hostingProvider" hint="Company name, address and phone number of the company hosting the website." optional class="lg:col-span-2">
          <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.hostingProvider" rows="3" maxlength="500" /></template>
        </FormField>
      </div>
    </section>

    <section class="card p-6" aria-labelledby="privacy-notice">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="privacy-notice" class="text-xl">Privacy notice</h2>
          <p class="mt-1 text-steel">How you handle the personal data sent through the quote and contact forms.</p>
        </div>
        <NuxtLink to="/privacy" target="_blank" class="link-arrow text-sm">View the page <Icon name="lucide:external-link" class="size-4" aria-hidden="true" /></NuxtLink>
      </div>
      <div class="mt-5 grid gap-5">
        <FormField id="dataRetention" :label="LABELS.dataRetention" hint="How long you keep quote requests and contact messages, and why." optional>
          <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.dataRetention" rows="3" maxlength="1000" placeholder="e.g. Quote requests and messages are kept for 3 years after our last exchange, then deleted." /></template>
        </FormField>
        <FormField id="dataProcessors" :label="LABELS.dataProcessors" hint="Service providers that handle the data for you (hosting, email…) and any transfer outside your country." optional>
          <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.dataProcessors" rows="3" maxlength="1000" /></template>
        </FormField>
        <FormField id="supervisoryAuthority" :label="LABELS.supervisoryAuthority" hint="Where visitors can complain about how their data is used." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.supervisoryAuthority" maxlength="200" placeholder="e.g. the Information Commissioner's Office (ico.org.uk)"></template>
        </FormField>
      </div>
      <p class="mt-5 text-sm text-steel">
        The rest of these pages is a starting point. Have them reviewed against your actual processing and the law that applies to you
        (for example UK GDPR and the Data Protection Act 2018).
      </p>
    </section>

    <button type="submit" class="btn btn-brand" :disabled="busy">Save</button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => emit('saved', s))
const LABELS = LEGAL_LABELS

const form = reactive(Object.fromEntries(LEGAL_FIELDS.map((k) => [k, props.settings[k] ?? ''])) as Record<LegalField, string>)

// Based on what is saved, so the warning matches the website
const missing = computed(() => missingLegalFields(props.settings).map((k) => LABELS[k]))
</script>
