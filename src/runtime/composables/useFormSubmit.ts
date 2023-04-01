import type { SubmitResult } from '../types'
import { reactive, toRefs } from 'vue'

export function useFormSubmit<T>(
  submitFunction: (data: SubmitResult<T>) => void | any | Promise<any> | Promise<void>,
  options: {
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
  } = {}
) {
  const ret = reactive({
    loading: false,
    data: null
  })

  const { onSuccess, onError } = options
  
  const submit = async (result: SubmitResult<T>) => {
    if (result.valid) {
      try {
        ret.loading = true
        ret.data = await submitFunction(result)
        ret.loading = false
        if (onSuccess) {
          onSuccess(ret.data)
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
    ...toRefs(ret) 
  }
}