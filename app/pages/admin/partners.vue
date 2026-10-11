<template>
  <div>
    <AdminPageTitle title="Partners" description="Transport partners shown at the bottom of the home page. Only active partners are displayed.">
      <button v-if="!form" type="button" class="btn btn-brand" @click="edit()">
        <Icon name="lucide:plus" class="size-5" aria-hidden="true" />
        Add a partner
      </button>
    </AdminPageTitle>

    <form v-if="form" class="card mt-8 space-y-5 p-6" novalidate @submit.prevent="save">
      <h2 class="text-xl">{{ form.id ? 'Edit partner' : 'New partner' }}</h2>
      <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <FormField id="p-name" label="Name">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.name" maxlength="120"></template>
        </FormField>
        <FormField id="p-website" label="Website" hint="Starts with https://" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.websiteUrl" type="url" placeholder="https://"></template>
        </FormField>
        <FormField id="p-logo" label="Logo address" hint="Link to the logo image (https://). Without a logo, the name is shown." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.logoUrl" type="url" placeholder="https://"></template>
        </FormField>
        <FormField id="p-order" label="Display order" hint="Smaller numbers come first.">
          <template #default="{ field }"><input v-bind="field" v-model.number="form!.displayOrder" type="number" min="0" max="999"></template>
        </FormField>
      </div>
      <label class="flex items-center gap-3 font-semibold">
        <input v-model="form!.isActive" type="checkbox" class="size-5 accent-[var(--brand)]">
        Shown on the website
      </label>
      <div class="flex gap-3">
        <button type="submit" class="btn btn-brand" :disabled="busy">Save</button>
        <button type="button" class="btn btn-ghost" @click="form = null">Cancel</button>
      </div>
    </form>

    <ul v-if="items?.length" class="card mt-8 divide-y divide-line overflow-hidden">
      <li v-for="p in items" :key="p.id" class="flex flex-wrap items-center gap-4 px-5 py-4">
        <span class="grid h-10 w-20 shrink-0 place-items-center rounded-lg bg-surface">
          <img v-if="p.logoUrl" :src="p.logoUrl" alt="" class="max-h-8 max-w-16 object-contain">
          <Icon v-else name="lucide:handshake" class="size-5 text-steel" aria-hidden="true" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold">{{ p.name }}</span>
          <span class="block truncate text-sm text-steel">{{ p.websiteUrl || 'No website' }} · order {{ p.displayOrder }}</span>
        </span>
        <AdminBadge :tone="p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">{{ p.isActive ? 'Shown' : 'Hidden' }}</AdminBadge>
        <button type="button" class="btn btn-ghost min-h-10 px-3.5 text-sm" @click="edit(p)">
          <Icon name="lucide:pencil" class="size-4" aria-hidden="true" />
          Edit
        </button>
        <AdminConfirmButton :busy="busy" @confirm="remove(p)" />
      </li>
    </ul>
    <AdminEmpty v-else-if="!form" class="mt-8" icon="lucide:handshake" title="No partners yet" text="Add the carriers and agents you work with." />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Partners' })

interface Partner { id?: number; name: string; websiteUrl: string; logoUrl: string; isActive: boolean; displayOrder: number }

const { notify } = useAdminNotices()
const { data: items, refresh } = await useAsyncData('adm-partners', () => adminFetch<Partner[]>('/api/partners/all'))

const form = ref<Partner | null>(null)
const error = ref('')
const busy = ref(false)

function edit(p?: Partner) {
  error.value = ''
  form.value = p ? { ...p } : { name: '', websiteUrl: '', logoUrl: '', isActive: true, displayOrder: (items.value?.length ?? 0) * 10 }
  nextTick(() => document.getElementById('p-name')?.focus())
}

async function save() {
  const f = form.value!
  if (!f.name) { error.value = 'Enter the partner name.'; return }
  busy.value = true
  error.value = ''
  const body = { name: f.name, websiteUrl: f.websiteUrl, logoUrl: f.logoUrl, isActive: f.isActive, displayOrder: f.displayOrder || 0 }
  try {
    await adminFetch(f.id ? `/api/partners/${f.id}` : '/api/partners', { method: f.id ? 'PUT' : 'POST', body })
    notify(f.id ? 'Partner updated' : 'Partner added')
    form.value = null
    await refresh()
  } catch (err) {
    error.value = apiError(err)
  } finally {
    busy.value = false
  }
}

async function remove(p: Partner) {
  busy.value = true
  try {
    await adminFetch(`/api/partners/${p.id}`, { method: 'DELETE' })
    notify('Partner deleted')
    await refresh()
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}
</script>
