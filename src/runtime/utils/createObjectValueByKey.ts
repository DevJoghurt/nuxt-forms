// create object and add a value with key that supports dot notation
export const createObjectValueByKey = (obj: any, key: string, value: any) => {
  const pathArr = key.split('.')
  // eslint-disable-next-line
  for (var i = 0, tmp = obj; i < pathArr.length - 1; i++) {
    if (typeof tmp[pathArr[i]] === 'undefined') {
      tmp = tmp[pathArr[i]] = {}
    } else {
      tmp = tmp[pathArr[i]]
    }
  }
  tmp[pathArr[i]] = value
}