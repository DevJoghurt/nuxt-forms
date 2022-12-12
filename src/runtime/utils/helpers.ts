// create object and add a value with key that supports dot notation
export const createObjectValueByKey = function (obj: any, key: string, value: any) {
    const pathArr = key.split('.')
    // eslint-disable-next-line
    for (var i = 0, tmp = obj; i < pathArr.length - 1; i++) {
      if (typeof tmp[pathArr[i]] === 'undefined') {
        tmp = tmp[pathArr[i]] = {}
      } else {
        tmp = tmp[pathArr[i]]
      }
    }
    if (Array.isArray(tmp[pathArr[i]]) && Array.isArray(value)) {
      tmp[pathArr[i]] = tmp[pathArr[i]].concat(value)
    }else{
      tmp[pathArr[i]] = value
    }
}

export function getValueByProperty<Object> (object: Object, name: String, defaultValue = null) {
  const value = name.split('.').reduce((o, k) => (o || {})[k], object)
  if (typeof value === 'undefined') { return defaultValue } else { return value }
}

/**
 * Replaces placeholder values in a string with their actual values
 * cc vee-validate https://github.com/logaretm/vee-validate/blob/1be36aba9add96c199f93f8e74f7c422e7e9ae1f/packages/i18n/src/utils.ts#L6
 */
 export function interpolate(template: string, values: Record<string, any>): string {
  return template.replace(/(\d:)?{([^}]+)}/g, function (_, param, placeholder): string {
    if (!param || !values.params) {
      return placeholder in values
        ? values[placeholder]
        : values.params && placeholder in values.params
        ? values.params[placeholder]
        : `{${placeholder}}`
    }

    // Handles extended object params format
    if (!Array.isArray(values.params)) {
      return placeholder in values.params ? values.params[placeholder] : `{${placeholder}}`
    }

    // Extended Params exit in the format of `paramIndex:{paramName}` where the index is optional
    const paramIndex = Number(param.replace(':', ''))

    return paramIndex in values.params ? values.params[paramIndex] : `${param}{${placeholder}}`
  })
}

export function isCallable(fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function';
}