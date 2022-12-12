import {  email, required, min, max, regex, url, between, confirmed, length, one_of, not_one_of, ext, image } from '@vee-validate/rules'
import { isRef } from '#imports'
import { getFormLocales } from '#build/form.imports'
import type { Locales, ValidationRuleFunction } from '../types'

export function useValidation(locale : Locales ='en') {
  const locales = getFormLocales()
  const selectedLocale = locales.find(localeObj => localeObj.code === locale)
  return {
    customRule: (func: ValidationRuleFunction) => {
      return () => ({
        errorMessage: null,
        params: null,
        validate: func
      })
    },
    between: (min: number | string, max: number | string) => ({
      errorMessage: selectedLocale?.messages?.between,
      params: {
        min: isRef(min) ? min.value : min,
        max: isRef(max) ? max.value : max
      },
      validate: between as ValidationRuleFunction
    }),
    email: () => ({
      errorMessage: selectedLocale?.messages?.email,
      params: null,
      validate: email
    }),
    required: () => ({
      errorMessage: selectedLocale?.messages?.required,
      params: null,
      validate: required
    }),
    min: (length: number|string) => ({
      errorMessage: selectedLocale?.messages?.min,
      params: {
        length: isRef(length) ? length.value : length
      },
      validate: min as ValidationRuleFunction
    }),
    max: (length: number|string) => ({
      errorMessage: selectedLocale?.messages?.max,
      params: {
        length: isRef(length) ? length.value : length
      },
      validate: max as ValidationRuleFunction
    }),
    regex: (regexp: string| RegExp) => ({
      errorMessage: selectedLocale?.messages?.regex,
      params: {
        regex: isRef(regexp) ? regexp.value : regexp
      },
      validate: regex as ValidationRuleFunction
    }),
    url: (pattern: string | RegExp) => ({
      errorMessage: selectedLocale?.messages?.url,
      params: {
        pattern: isRef(pattern) ? pattern.value : pattern
      },
      validate: url as ValidationRuleFunction
    }),
    confirmed: (target: string) => ({
      errorMessage: selectedLocale?.messages?.confirmed,
      params: {
        target: isRef(target) ? target.value : target
      },
      validate: confirmed as ValidationRuleFunction
    }),
    length: (lengthVal: number|string) => ({
      errorMessage: selectedLocale?.messages?.length,
      params: {
        length: isRef(lengthVal) ? lengthVal.value : lengthVal
      },
      validate: length as ValidationRuleFunction
    }),
    one_of: (list: unknown[]) => ({
      errorMessage: selectedLocale?.messages?.one_of,
      params: list,
      validate: one_of as ValidationRuleFunction
    }),
    not_one_of: (list: unknown[]) => ({
      errorMessage: selectedLocale?.messages?.not_one_of,
      params: list,
      validate: not_one_of as ValidationRuleFunction
    }),
    ext: (extensions: string[]) => ({
      errorMessage: selectedLocale?.messages?.ext,
      params: extensions,
      validate: ext as ValidationRuleFunction
    }),
    image: () => ({
      errorMessage: selectedLocale?.messages?.image,
      params: null,
      validate: image as ValidationRuleFunction
    }),
  }
}