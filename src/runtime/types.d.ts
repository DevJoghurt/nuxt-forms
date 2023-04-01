import type { ZodTypeAny, ZodObject } from 'zod'

// Rule types
export type ValidationRuleFunction = (
  value: unknown,
  params:  Record<string, unknown> | unknown[] | null
) => boolean | string | Promise<boolean | string>

export type ValidationRule = {
  errorMessage: string | null | undefined
  params: Record<string, unknown> | unknown[] | null
  validate: ValidationRuleFunction
}

export type FormOptions = {
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

export type Locale = 
  | 'custom'
  | 'en'
  | 'de'
  | 'es'
  | 'fr'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pt'
  | 'ru'
  | 'zh'

export type LocaleObject = {
  code: Locale
  messages: LocaleMessages
}

export type LocaleMessages = {
  _default?: string
  between?: string
  confirmed?: string
  email?: string
  ext?: string
  image?: string
  length?: string
  max?: string
  min?: string
  not_one_of?: string
  one_of?: string
  regex?: string
  required?: string
  size?: string
  url?: string
}