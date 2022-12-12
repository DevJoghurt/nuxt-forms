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
  initializeData: (initialData: any) => void
  validate: () => FieldData | Promise<FieldData>
}

export type FormContext = {
  schema?: ZodTypeAny
  bind: (field: FieldContext) => void
  unbind: (name: string) => void
}

export type FieldData = {
  valid: boolean
  updated: boolean
  errors: string[]
  value: any
}

export type FormFields = Record<string, FieldData>

export type FormData = {
  valid: boolean
  errors: string[]
  value: any
}


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