import type { ValidatorRuleParams, ValidatorParams, Validator, ErrorMessage } from '../types'

type ValidationRuleFunction = keyof ValidatorRuleParams | Validator

export function useValidation<T extends ValidationRuleFunction> (
  validationFunction: T,
  error: ErrorMessage = null
) {
  return (params?: ValidatorParams<T>) => ({
    errorMessage: error || 'Error',
    params,
    validate: validationFunction
  })
}
