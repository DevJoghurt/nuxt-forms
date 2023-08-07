const requiredRule = (value: unknown) => {
  if (!value || typeof value !== 'string') { return false }
  return value.trim().length > 0
}

export default requiredRule
