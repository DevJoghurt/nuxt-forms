import type { FormContext } from '../types'
import type { InjectionKey } from 'vue'

export const FormContextKey: InjectionKey<FormContext> = Symbol('nuxt-form')