import { ValidatorAdapter, ValidateFunction, FormValues, ValidatorType, ValidationType } from '../types'
import { isCallable } from './isCallable'

type Validations<T extends ValidationType> = {
  type: ValidatorType
  params: any
  validate: ValidateFunction<T>
}

type ValidatorTransform<T extends ValidationType> = {
  isValidator: boolean
  initialFormData: Array<FormValues | string>
  initialFieldData: any | null
  validations: Validations<T>[]
}

function getAsArray<T extends ValidationType> (validators: ValidatorAdapter<T> | ValidatorAdapter<T>[] | undefined) : ValidatorAdapter<T>[] {
  // check if validators is an array and double check if it is not an object or empty array
  if (Array.isArray(validators) && validators.length && typeof validators[0] === 'object') {
    // if it is an array of objects, return the array
    return validators
  } else if (typeof validators === 'object') {
    // if it is an object, return an array with the object
    return [validators] as ValidatorAdapter<T>[]
  } else {
    return []
  }
}

/**
 * @description
 * This function transforms the validator from the options into a format that can be used by useForm or useField
 * @param validationType - The type of validation, either 'form' or 'field'
 * @param validator - The validator from the options
 * @returns {ValidatorTransform} - The transformed validator
 *
 **/
export function transformValidator<T extends ValidationType> (validationType: T, validator: ValidatorAdapter<T> | ValidatorAdapter<T>[] | undefined) {
  const validatorArray = getAsArray<T>(validator)
  const transformedValidator: ValidatorTransform<T> = {
    isValidator: validatorArray.length > 0,
    initialFormData: [],
    initialFieldData: null,
    validations: []
  }
  for (const validator of validatorArray) {
    // check if the validator type is allowed on the validation type - form initial data must be an object
    if (validationType === 'form' && validator.initialData && typeof validator.initialData === 'object') {
      transformedValidator.initialFormData.push(validator.initialData)
    }
    // use only the latest initial field data if more than one validator is defined -field initial data is only the value itself
    if (validationType === 'field' && validator.initialData) {
      transformedValidator.initialFieldData = validator.initialData
    }
    if (validator?.validate && isCallable(validator.validate)) {
      transformedValidator.validations.push({
        type: validator.type,
        params: validator.params,
        validate: validator.validate
      })
    } else {
      console.warn(`The validator ${validator.type} does not have a validate function`)
    }
  }

  return transformedValidator
}
