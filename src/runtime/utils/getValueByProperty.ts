export function getValueByProperty<T> (object: Record<string, any>, name: string, defaultValue: any = null): T | Record<string, any> {
    const value = name.split('.').reduce((o, k) => (o || {})[k], object)
    if ((typeof value === 'undefined' || value === null) && defaultValue == null ) { 
      return defaultValue 
    }
    else if (typeof value === 'string' && value === '' && defaultValue !== null) {
      return defaultValue
    }
    else { 
      return value 
    }
}