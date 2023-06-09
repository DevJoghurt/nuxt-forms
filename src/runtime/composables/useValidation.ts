import type { ValidationRule, ValidationRuleFunction, ErrorMessage, ValidationParams } from '../types.js'

export function useValidation (validationFunction: ValidationRuleFunction, error: ErrorMessage = null) {
  return (params: ValidationParams = null): ValidationRule => ({
    errorMessage: error || 'Error',
    params,
    validate: validationFunction
  })
}
