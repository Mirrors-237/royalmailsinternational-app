// Submits a public form to the API and turns its responses into messages a visitor can act on.
export function useFormSubmit<T>(endpoint: string) {
  const sending = ref(false)
  const done = ref(false)
  const formError = ref('')

  async function submit(body: Record<string, unknown>): Promise<T | undefined> {
    sending.value = true
    formError.value = ''
    try {
      const result = await $fetch<T>(endpoint, { method: 'POST', body })
      done.value = true
      return result
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 429) {
        formError.value = "You've sent several requests in a short time. Please wait a few minutes and try again."
      } else if (status === 400) {
        formError.value = 'Some details look incorrect. Check the highlighted fields and try again.'
      } else {
        formError.value = "We couldn't send your request. Please try again in a few moments, or contact us by phone."
      }
    } finally {
      sending.value = false
    }
  }

  return { sending, done, formError, submit }
}
