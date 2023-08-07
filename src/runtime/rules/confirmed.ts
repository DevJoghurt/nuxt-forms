import { RuleParams } from '../types'

const confirmedRule = (value: unknown, param: RuleParams<'confirmed'> = { comparative: 'true' }) : boolean => {
  const { comparative } = param
  return String(value) === String(comparative)
}

export default confirmedRule