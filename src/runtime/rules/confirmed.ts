import { ValidatorParams } from '../types'

const confirmedValidator = (value: unknown, param: ValidatorParams<'confirmed'> = { comparative: 'true'}) : boolean => {
    const { comparative } = param
    return String(value) === String(comparative)
}
  
export default confirmedValidator