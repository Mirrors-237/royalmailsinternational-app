<template>
  <div>
    <AdminPageTitle title="Account" :description="`Signed in as ${user?.email ?? ''}`" />

    <form class="card mt-8 max-w-xl p-6" novalidate @submit.prevent="submit">
      <h2 class="text-xl">Change your password</h2>
      <p class="mt-1 text-steel">Other devices signed in to this account will be signed out.</p>

      <p v-if="error" class="mt-5 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

      <div class="mt-5 space-y-5">
        <FormField id="current-password" label="Current password">
          <template #default="{ field }"><input v-bind="field" v-model="form.current" type="password" autocomplete="current-password" required></template>
        </FormField>
        <FormField id="new-password" label="New password" :hint="`At least ${MIN_LENGTH} characters. A few unrelated words make a strong password that is easy to remember.`">
          <template #default="{ field }"><input v-bind="field" v-model="form.next" type="password" autocomplete="new-password" :minlength="MIN_LENGTH" maxlength="128" required></template>
        </FormField>
        <FormField id="confirm-password" label="New password again">
          <template #default="{ field }"><input v-bind="field" v-model="form.confirm" type="password" autocomplete="new-password" maxlength="128" required></template>
        </FormField>
      </div>

      <button type="submit" class="btn btn-brand mt-7" :disabled="busy">
        <Icon v-if="busy" name="lucide:refresh-cw" class="size-5 animate-spin" aria-hidden="true" />
        Change password
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Account' })

// Same rule as the API (src/modules/auth/password.ts)
const MIN_LENGTH = 12

const user = useAdminUser()
const { notify } = useAdminNotices()
const form = reactive({ current: '', next: '', confirm: '' })
const error = ref('')
const busy = ref(false)

async function submit() {
  error.value = ''
  if (!form.current) { error.value = 'Enter your current password.'; return }
  if (form.next.length < MIN_LENGTH) { error.value = `The new password must be at least ${MIN_LENGTH} characters long.`; return }
  if (form.next !== form.confirm) { error.value = 'The two new passwords do not match.'; return }
  if (form.next === form.current) { error.value = 'The new password must be different from the current one.'; return }

  busy.value = true
  try {
    await adminFetch('/api/auth/password', { method: 'PATCH', body: { currentPassword: form.current, newPassword: form.next } })
    Object.assign(form, { current: '', next: '', confirm: '' })
    notify('Password changed')
  } catch (err) {
    error.value = apiError(err)
  } finally {
    busy.value = false
  }
}
</script>
