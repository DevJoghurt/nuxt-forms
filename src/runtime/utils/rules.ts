import type { LocaleTypes } from './locales'

export type DefaultRuleTypes = 'email' | 'tel' | 'required' | 'password_length' | 'password_uppercase' | 'password_lowercase' | 'password_number' | 'password_special' | 'is_true'

export interface Rule {
    validator: (key: string) => boolean,
    error: keyof LocaleTypes | string
}

export type RulesetTypes = 'email' | 'password' | 'required' | 'approval' | 'tel'

export type Rulesets = Record <RulesetTypes, DefaultRuleTypes[]>

export type DefaultRules = Record<DefaultRuleTypes, Rule>

export type Rules = (RulesetTypes|Rule)[] | RulesetTypes

type Data = {
    valid: boolean,
    updated: boolean,
    error: string,
    value: any
}

const defaultRules = {
  email: {
    validator: (value: string | null) => {
      if (value === null) { return true }
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(value).toLowerCase())
    },
    error: 'email_invalid'
  },
  tel: {
    validator: (value: string | null) => {
      if (value === null) { return true }
      const re = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g
      return re.test(String(value))
    },
    error: 'tel_invalid'
  },
  is_true: {
    validator: (value: any) => {
      return value === true || value === 'true' || value === 1 || value === '1' || value === 'on' || value === null
    },
    error: 'is_true'
  },
  required: {
    validator: (value: string) => {
      return value !== '' && value !== null
    },
    error: 'required'
  },
  password_length: {
    validator: (value: string) => {
      return value ? value.length >= 8 : false
    },
    error: 'password_length'
  },
  password_uppercase: {
    validator: (value: string) => {
      return /[A-Z]/.test(value)
    },
    error: 'password_uppercase'
  },
  password_lowercase: {
    validator: (value: string) => {
      return /[a-z]/.test(value)
    },
    error: 'password_lowercase'
  },
  password_number: {
    validator: (value: string) => {
      return /[0-9]/.test(value)
    },
    error: 'password_number'
  },
  password_special: {
    validator: (value: string) => {
      return /[!@#$%^&*(),.?":{}|<>]/.test(value)
    },
    error: 'password_special'
  }
} as DefaultRules

const defaultRulesets = {
  tel: ['tel'],
  email: ['email'],
  required: ['required'],
  approval: ['is_true'],
  password: ['password_length', 'password_uppercase', 'password_lowercase', 'password_number', 'password_special']
} as Rulesets

export function useRules (locales: LocaleTypes, data: Data) {
  const validationRules = [] as Rule[]

  const addRules = (rules: Rules) => {
    // If rules is a string, get the ruleset
    if (typeof rules === 'string') {
      if (typeof defaultRulesets[rules] !== 'undefined') {
        defaultRulesets[rules].forEach((ruleType) => {
          validationRules.push(defaultRules[ruleType])
        })
      }
    } else if (Array.isArray(rules)) {
      for (const rule of rules) {
        if (typeof rule === 'string') {
          if (typeof defaultRulesets[rule] !== 'undefined') {
            defaultRulesets[rule].forEach((ruleType) => {
              validationRules.push(defaultRules[ruleType])
            })
          }
        } else {
          validationRules.push(rule)
        }
      }
    } else {
      validationRules.push(rules)
    }
  }

  const validate = () => {
    // reset data error
    data.error = null
    data.valid = true
    // loop through rules
    validationRules.some((rule) => {
      const isValid = rule.validator(data.value)
      if (!isValid) {
        data.valid = false
        data.error = typeof locales[rule.error] !== 'undefined' ? locales[rule.error] : (typeof rule.error === 'string' ? rule.error : 'error')
      }
      return isValid === false
    })
    return data
  }

  return {
    addRules,
    validate
  }
}
