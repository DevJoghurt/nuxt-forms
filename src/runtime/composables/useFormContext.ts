import { FormContextKey } from '../utils/symbols'
import type { FormContext } from '../types'
import { inject } from '#imports'

export function useFormContext () {
  const formContext = inject<FormContext>(FormContextKey) || null
  return formContext
}
