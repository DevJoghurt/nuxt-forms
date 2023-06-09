import type { ZodTypeAny, ZodObject } from 'zod'
import type { InjectionKey } from 'vue'

// Rule types
export type ValidationParams = Record<string, unknown> | unknown[] | null

export type ErrorMessage = string | null | undefined |  Partial<Record<string, string>>


export type ValidationRuleFunction = (
  value: unknown,
  params:  any
) => boolean | string | Promise<boolean | string>

export type ValidationRule = {
  errorMessage: ErrorMessage
  params: ValidationParams
  validate: ValidationRuleFunction
}

export type FormOptions = {
  lang?: string
  key?: InjectionKey<FormContext>
  initialData?: object | null
  clearOnSubmit?: boolean
  schema?: ZodTypeAny
}

export type FieldOptions = {
  initialData: any
  schema?: ZodTypeAny
  rules?: (ValidationRule | (() => ValidationRule))[]
  validateOnChange?: boolean
  label?: string | null
  onValidate?: (value: any) => void
}

export type FieldContext = {
  name: string
  setErrors: (errors: string[]) => void
  setValid: (valid: boolean) => void
  initializeData: (initialData: any) => void
  validate: () => FieldData | Promise<FieldData>
}

export type FieldErrors = {
  _errors: string[]
}

export type Schema = ZodSchema<ZodObject>

export type FormContext = {
  lang: string | undefined
  isFormValidation: boolean
  validate: (fieldName: string | null) => FormData | Promise<FormData>
  bind: (field: FieldContext) => void
  unbind: (name: string) => void
}

export type FieldData = {
  valid: boolean
  updated: boolean
  errors: string[]
  value: any
}

export type FormData = {
  valid: boolean
  errors: string[]
  value: Record<string, unknown>
}

export type FormFields = {
  [key: string]: FieldData
}

type SubmitFieldData<T> =
  T extends Record<string, unknown> ?
  { [K in keyof T]: SubmitFieldData<T[K]> } :
  { valid: boolean, updated: boolean, errors: string[], value: T };

type SubmitFormFields<T> =
  T extends Record<string, unknown> ?
  { [K in keyof T]: SubmitFormFields<T[K]> } & { [P in keyof T]: T[P] extends Record<string, unknown> ? never : SubmitFieldData<T[P]> } :
  { [key: string]: SubmitFieldData<any> };

export type SubmitResult<T> =
  { valid: boolean, value: T, errors: string[], fields: SubmitFormFields<T> };