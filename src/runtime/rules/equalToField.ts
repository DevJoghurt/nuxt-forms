import { RuleParams, FormValues } from '../types'
import { getValueByProperty } from '../utils/getValueByProperty'
import isEmpty from '../utils/isEmpty'

const equalToFieldRule = (value: unknown, param: RuleParams<'equalToField'> = { field: ''}, formData: FormValues) : boolean => {
  let fieldData = '' as unknown
  if (!isEmpty(formData)) {
    fieldData = getValueByProperty(formData, param.field, null)
  }
  return String(value) === String(fieldData)
}

export default equalToFieldRule
