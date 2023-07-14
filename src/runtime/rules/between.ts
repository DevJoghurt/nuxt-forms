import { isEmpty } from '../utils/common'
import { ValidatorParams } from '../types'

type BetweenParams = [string | number, string | number] | { min: number | string; max: number | string };

function getParams(params: BetweenParams) {
  if (Array.isArray(params)) {
    return { min: params[0], max: params[1] };
  }

  return params;
}

const betweenValidator = (value: string | number, params: ValidatorParams<'between'>): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  const { min, max } = getParams(params);
  if (Array.isArray(value)) {
    return value.every(val => betweenValidator(val, { min, max }));
  }

  const valueAsNumber = Number(value);
  return Number(min) <= valueAsNumber && Number(max) >= valueAsNumber;
};

export default betweenValidator;