import isEmpty from '../utils/isEmpty'
import { RuleParams } from '../types'

const betweenRule = (value: string | number, params: RuleParams<'between'>): boolean => {
  if (isEmpty(value)) {
    return true
  }

  const { min = 0, max = 10 } = params
  if (Array.isArray(value)) {
    return value.every(val => betweenRule(val, { min, max }))
  }

  const valueAsNumber = Number(value)
  return Number(min) <= valueAsNumber && Number(max) >= valueAsNumber
}

export default betweenRule
