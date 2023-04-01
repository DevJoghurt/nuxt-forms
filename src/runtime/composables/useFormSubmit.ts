import type { SubmitResult } from '../types'
import { ref } from 'vue'

export function useFormSubmit<T>(
  submitFunction: (data: SubmitResult<T>) => void | Promise<void>,
  options: {
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
  } = {}
) {
  const loading = ref(false)
  const { onSuccess, onError } = options
  
  const submit = async (result: SubmitResult<T>) => {
    if (result.valid) {
      try {
        loading.value = true
        const data = await submitFunction(result)
        loading.value = false
        if (onSuccess) {
          onSuccess(data)
        }
      } catch (error) {
        if (onError) {
          onError(error)
        }
      }
    }
  }
  
  return { 
    submit,
    loading 
  }
}