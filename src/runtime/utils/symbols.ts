import type { InjectionKey } from 'vue'
import type { FormContext } from '../types'

export const FormContextKey: InjectionKey<FormContext> = Symbol('nuxt-form')
