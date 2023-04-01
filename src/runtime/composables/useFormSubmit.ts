import type { SubmitResult } from '../types'
import { reactive, toRefs } from 'vue'

type Options<D, E> = {
  onSuccess?: (data: D | null) => void,
  onError?: (error: E | null) => void
};

type ReturnType<D , E> = {
  loading: boolean
  error: E | null
  data: D | null
}

export function useFormSubmit<T, D = {}, E = {}>(
  submitFunction: (data: SubmitResult<T>) => void | any | Promise<any> | Promise<void>,
  options: Options<D, E> = {}
) {
  const ret = reactive<ReturnType<D, E>>({
    loading: false,
    error: null,
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
          onSuccess(ret.data as D)
        }
      } catch (error: any) {
        ret.error = error
        ret.loading = false
        if (onError) {
          onError(ret.error as E)
        }
      }
    }
  }
  
  return { 
    submit,
    ...toRefs(ret) 
  }
}