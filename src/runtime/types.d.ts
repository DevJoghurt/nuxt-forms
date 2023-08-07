// Validator types
export type FormValues = Record<string, unknown>

export type CustomValidator = (value: any, params: any, formValues: FormValues) => Promise<boolean> | boolean

export type ValidatorType = 'rule' | 'zod' | 'valibot' | 'custom'

type ValidatorError = {
  field: string
  form: Record<string, string>
}

export type ValidateResult<T extends ValidationType> = {
  success: boolean
  error: ValidatorError[T]
}

export type ValidationParams = {
  field?: string
}
export type ValidationType = 'form' | 'field'

export type ValidateFunction<T extends ValidationType> = (validationType: T, data: FormValues, params?: ValidationParams) => Promise<ValidateResult<T>>

export interface ValidatorAdapter<T extends ValidationType> {
  type: ValidatorType
  params?: any
  initialData: FormValues
  validate: ValidateFunction<T>
}

export type DefinedRuleParams = {
  'between': { min: number | string; max: number | string }
  'email': undefined
  'equalToField': { field: string }
  'confirmed': { comparative: unknown }
  'required': undefined
  'numeric': undefined
}

export type RuleParams<T> = T extends keyof DefinedRuleParams
  ? DefinedRuleParams[T]
  : undefined;

export type FormOptions = {
  initialData?: FormData | null
  clearOnSubmit?: boolean
  validate?: ValidatorAdapter | ValidatorAdapter[]
}

export type FieldData = {
  valid: boolean
  updated: boolean
  errors: string[]
  value: any
}

export type FormFields = {
  [key: string]: FieldData
}

export type FormData = {
  updated: boolean
  valid: boolean
  errors: string[]
  value: Record<string, unknown>
}

export type FieldContext = {
  name: string
  label: string | null
  getData: () => any
  setError: (error: string) => void
  setValid: (valid: boolean) => void
  initializeData: (initialData: any) => void
  validate: () => FieldData | Promise<FieldData>
  reset: () => void
}

export type FieldOptions = {
  initialData: any
  validate?: ValidatorAdapter | ValidatorAdapter[]
  validateOnChange?: boolean | 'form' | 'field'
  bindFormData?: boolean
  label?: string | null
  autoRegister?: boolean
  onValidate?: (value: any) => void
}

export type FormContext = {
  isFormValidation: boolean
  getData: () => {
    data: FormValue
    flattenedData: FormValue
  }
  validate: (fieldName: string | null) => FormData | Promise<FormData>
  register: (field: FieldContext) => void
  unregister: (name: string) => void
}

// old types - to be checked

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