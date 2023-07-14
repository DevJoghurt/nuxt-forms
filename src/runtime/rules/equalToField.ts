import { ValidatorParams, BindedFormData } from '../types'
import { isEmpty, getValueByProperty } from '../utils/common'

const equalToFieldValidator = (value: unknown, param: ValidatorParams<'equalToField'> = '', formData: BindedFormData) : boolean => {
    let fieldData = '' as unknown
    if(!isEmpty(formData)){
        fieldData = getValueByProperty(formData, param, null)
    }
    return String(value) === String(fieldData)
}
  
export default equalToFieldValidator