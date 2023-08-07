import { ValidatorAdapter,  ValidationType, ValidateResult, ValidationParams, CustomValidator } from '../types'
import { isCallable } from '../utils/isCallable'
import { getValueByProperty } from '../utils/getValueByProperty'


type CustomValidatorOptions = {
  errorMessage?: string
  initialData?: any
  params?: any
}

export function useCustomValidator (
  rule: CustomValidator,
  options: CustomValidatorOptions = {
    errorMessage: 'Invalid value',
    initialData: null,
    params: undefined
  }
) : ValidatorAdapter<ValidationType> {

  const validate = async(validationType: ValidationType, data: any, validationParams: ValidationParams | undefined): Promise<ValidateResult<ValidationType>>  => {
    let result = {
      success: true,
      error: ''
    }
    if(validationType === 'field'){
      let fieldData = null
      if(validationParams?.field){
        fieldData = getValueByProperty(data, validationParams.field, null)
      }
      if(isCallable(rule)){
        result.success = await rule(fieldData, options.params, data)
        if(!result.success){
          result.error = options.errorMessage || 'Invalid value'
        }
      }
    }else{
      console.warn('Rule validator only supports field validation')
    }
    return result
  }

  return {
    type: 'rule',
    params: options.params,
    initialData: options.initialData,
    validate
  }
}