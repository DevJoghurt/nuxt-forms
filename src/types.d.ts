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

// Form component types
export type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: SubmitResult, dataPassThrough: any): void
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
  schema?: ZodObject
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


export type Locales = 
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

export type RuleType = 
  | 'alpha'
  | 'alpha_dash'
  | 'alpha_num'
  | 'alpha_spaces'
  | 'between'
  | 'confirmed'
  | 'digits'
  | 'dimensions'
  | 'email'
  | 'ext'
  | 'image'
  | 'integer'
  | 'is'
  | 'is_not'
  | 'length'
  | 'max'
  | 'max_value'
  | 'mimes'
  | 'min'
  | 'min_value'
  | 'not_one_of'
  | 'numeric'
  | 'one_of'
  | 'regex'
  | 'required'
  | 'size'
  | 'url'