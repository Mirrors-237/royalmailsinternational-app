<template>
  <div>
    <AdminPageTitle title="Testimonials" description="Customer reviews shown on the home page (the first three active ones). Only publish reviews from real customers, with their agreement.">
      <button v-if="!form" type="button" class="btn btn-brand" @click="edit()">
        <Icon name="lucide:plus" class="size-5" aria-hidden="true" />
        Add a testimonial
      </button>
    </AdminPageTitle>

    <form v-if="form" class="card mt-8 space-y-5 p-6" novalidate @submit.prevent="save">
      <h2 class="text-xl">{{ form.id ? 'Edit testimonial' : 'New testimonial' }}</h2>
      <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>
      <div class="grid gap-4 sm:grid-cols-3">
        <FormField id="t-name" label="Customer name">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.name" maxlength="120"></template>
        </FormField>
        <FormField id="t-role" label="Job title" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.role" maxlength="120"></template>
        </FormField>
        <FormField id="t-company" label="Company" optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.company" maxlength="120"></template>
        </FormField>
      </div>
      <FormField id="t-content" label="Review" hint="Between 10 and 1,000 characters.">
        <template #default="{ field }"><textarea v-bind="field" v-model.trim="form!.content" rows="4" maxlength="1000" /></template>
      </FormField>
      <div class="grid gap-4 sm:grid-cols-3">
        <fieldset>
          <legend class="font-bold">Rating</legend>
          <div class="mt-2 flex gap-1">
            <label v-for="n in 5" :key="n" class="cursor-pointer">
              <input v-model="form!.rating" type="radio" name="t-rating" :value="n" class="peer sr-only">
              <Icon name="lucide:star" class="size-7 rounded peer-focus-visible:outline-3 peer-focus-visible:outline-brand" :class="n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-line'" aria-hidden="true" />
              <span class="sr-only">{{ n }} out of 5</span>
            </label>
          </div>
        </fieldset>
        <FormField id="t-initials" label="Initials" hint="Shown in the round badge." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form!.avatarInitials" maxlength="3" class="field w-24 px-3.5 py-2.5 uppercase"></template>
        </FormField>
        <FormField id="t-order" label="Display order" hint="Smaller numbers come first.">
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

    <ul v-if="items?.length" class="mt-8 grid gap-4 lg:grid-cols-2">
      <li v-for="t in items" :key="t.id" class="card flex flex-col p-5">
        <div class="flex items-start justify-between gap-3">
          <p class="flex gap-0.5 text-amber-400" :aria-label="`Rated ${t.rating} out of 5`">
            <Icon v-for="n in 5" :key="n" name="lucide:star" class="size-4" :class="n <= t.rating ? 'fill-current' : 'text-line'" aria-hidden="true" />
          </p>
          <AdminBadge :tone="t.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">{{ t.isActive ? 'Shown' : 'Hidden' }}</AdminBadge>
        </div>
        <blockquote class="mt-3 flex-1 text-steel">“{{ t.content }}”</blockquote>
        <p class="mt-3 text-sm"><span class="font-bold">{{ t.name }}</span><template v-if="t.role || t.company">, {{ [t.role, t.company].filter(Boolean).join(', ') }}</template></p>
        <div class="mt-4 flex gap-2 border-t border-line pt-4">
          <button type="button" class="btn btn-ghost min-h-10 px-3.5 text-sm" @click="edit(t)">
            <Icon name="lucide:pencil" class="size-4" aria-hidden="true" />
            Edit
          </button>
          <AdminConfirmButton :busy="busy" @confirm="remove(t)" />
        </div>
      </li>
    </ul>
    <AdminEmpty v-else-if="!form" class="mt-8" icon="lucide:message-square-quote" title="No testimonials yet" text="Add reviews from customers who agreed to be quoted." />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Testimonials' })

interface Testimonial { id?: number; name: string; role: string; company: string; content: string; rating: number; avatarInitials: string; isActive: boolean; displayOrder: number }

const { notify } = useAdminNotices()
const { data: items, refresh } = await useAsyncData('adm-testimonials', () => adminFetch<Testimonial[]>('/api/testimonials/all'))

const form = ref<Testimonial | null>(null)
const error = ref('')
const busy = ref(false)

function edit(t?: Testimonial) {
  error.value = ''
  form.value = t ? { ...t } : { name: '', role: '', company: '', content: '', rating: 5, avatarInitials: '', isActive: true, displayOrder: (items.value?.length ?? 0) * 10 }
  nextTick(() => document.getElementById('t-name')?.focus())
}

async function save() {
  const f = form.value!
  if (!f.name) { error.value = 'Enter the customer name.'; return }
  if (f.content.length < 10) { error.value = 'The review must be at least 10 characters long.'; return }
  busy.value = true
  error.value = ''
  const initials = f.avatarInitials || f.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)
  const body = { name: f.name, role: f.role, company: f.company, content: f.content, rating: f.rating, avatarInitials: initials.toUpperCase(), isActive: f.isActive, displayOrder: f.displayOrder || 0 }
  try {
    await adminFetch(f.id ? `/api/testimonials/${f.id}` : '/api/testimonials', { method: f.id ? 'PUT' : 'POST', body })
    notify(f.id ? 'Testimonial updated' : 'Testimonial added')
    form.value = null
    await refresh()
  } catch (err) {
    error.value = apiError(err)
  } finally {
    busy.value = false
  }
}

async function remove(t: Testimonial) {
  busy.value = true
  try {
    await adminFetch(`/api/testimonials/${t.id}`, { method: 'DELETE' })
    notify('Testimonial deleted')
    await refresh()
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}
</script>
