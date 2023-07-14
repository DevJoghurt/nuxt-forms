import type { ZodTypeAny, ZodObject, AnyZodObject } from 'zod'
import type { InjectionKey } from 'vue'

// Rule types
export type ErrorMessage = string | null | undefined

export type ValidatorRuleParams = {
  'between': [string | number, string | number] | { min: number | string; max: number | string }
  'email': undefined
  'equalToField': string
  'confirmed': {
    comparative: unknown
  }
  'required': undefined
  'numeric': boolean
}

export type ValidatorParams<T extends ValidationRuleFunction> = T extends keyof ValidatorRuleParams
  ? ValidatorRuleParams[T]
  : undefined;

export type BindedFormData = Record<string, unknown>

type ValidationParams = Record<string, unknown> | unknown[] | null | unknown

export type Validator = (value: any, params: ValidationParams, formData: BindedFormData) => boolean | string | Promise<boolean | string>

export type ValidationRule = {
  errorMessage: ErrorMessage
  params: ValidationParams
  validate: Validator
}

export type FormOptions = {
  initialData?: object | null
  clearOnSubmit?: boolean
  schema?: AnyZodObject
}

export type FieldOptions = {
  initialData: any
  schema?: AnyZodObject
  rules?: (ValidationRule | (() => ValidationRule))[]
  validateOnChange?: boolean | 'form' | 'field'
  bindFormData?: boolean
  label?: string | null
  onValidate?: (value: any) => void
}

export type FieldContext = {
  name: string
  getData: () => any
  setErrors: (errors: string[]) => void
  setValid: (valid: boolean) => void
  initializeData: (initialData: any) => void
  validate: () => FieldData | Promise<FieldData>
  reset: () => void
}

export type FieldErrors = {
  _errors: string[]
}

export type Schema = ZodSchema<ZodObject>

export type FormContext = {
  isFormValidation: boolean
  getData: () => Record<string, unknown>
  validate: (fieldName: string | null) => FormData | Promise<FormData>
  bind: (field: FieldContext) => void
  unbind: (name: string) => void
  reset: () => void
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