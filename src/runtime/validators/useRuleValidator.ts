import { ValidatorAdapter,  DefinedRuleParams, ValidationType, CustomValidator } from '../types'
import { isCallable } from '../utils/isCallable'
import { useCustomValidator } from './useCustomValidator'


type RuleValidatorOptions<T extends keyof DefinedRuleParams> = {
  errorMessage?: string
  initialData?: any
  params?: DefinedRuleParams[T]
}

export function useRuleValidator<T extends keyof DefinedRuleParams> (
  ruleName: T,
  options: RuleValidatorOptions<T> = {
    errorMessage: 'Invalid value',
    initialData: null,
    params: undefined
  },
  rule?: CustomValidator
) : ValidatorAdapter<ValidationType> {

  if(ruleName && isCallable(rule)){
    return useCustomValidator(rule, {
      errorMessage: options.errorMessage,
      initialData: options.initialData,
      params: options.params
    })
  }
  else{
    throw new Error('Rule is not defined')
  }
}