import { RuleParams, FormValues } from '../types'
import { getValueByProperty } from '../utils/getValueByProperty'
import isEmpty from '../utils/isEmpty'

const equalToFieldRule = (value: unknown, param: RuleParams<'equalToField'> = { field: '' }, formData: FormValues) : boolean => {
  let fieldData = '' as unknown
  if (!isEmpty(formData)) {
    fieldData = getValueByProperty(formData, param.field, null)
    if (formData[param.field] === undefined) {
      console.warn(`Field ${param.field} does not exist in form data. Did you forget to bind form data to field?`)
    }
  }
  return String(value) === String(fieldData)
}

export default equalToFieldRule
