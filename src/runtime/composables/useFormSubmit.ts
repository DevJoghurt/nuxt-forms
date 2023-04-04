import type { SubmitResult } from '../types'
import { reactive, toRefs } from 'vue'

type Options<T, D, E> = {
  onSuccess?: (data: D | null) => void,
  onError?: (error: E | null) => void,
  onFormError?: (data: SubmitResult<T>) => void
};

type ReturnType<D , E> = {
  loading: boolean
  success: boolean
  error: E | null
  data: D | null
}

export function useFormSubmit<T, D = {}, E = {}>(
  submitFunction: (data: SubmitResult<T>) => void | any | Promise<any> | Promise<void>,
  options: Options<T, D, E> = {}
) {
  const ret = reactive<ReturnType<D, E>>({
    loading: false,
    success: false,
    error: null,
    data: null
  })

  const { onSuccess, onError, onFormError } = options
  
  const submit = async (result: SubmitResult<T>) => {
    ret.success = false
    if (result.valid) {
      try {
        ret.error = null
        ret.loading = true
        ret.data = await submitFunction(result)
        ret.success = true
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
    }else{
      if (onFormError) {
        onFormError(result)
      }
    }
  }
  
  return { 
    submit,
    ...toRefs(ret) 
  }
}