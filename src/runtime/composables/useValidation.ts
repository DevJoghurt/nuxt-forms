import {  email, required, min } from '@vee-validate/rules'
import { getFormLocales } from '#build/form.imports'
import type { Locales, ValidationRuleFunction } from '../../types'

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
        length
      },
      validate: min as ValidationRuleFunction
    })
  }
}