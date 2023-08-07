/**
 * check if a value is callable
 * @param fn
 * @returns
 */
export function isCallable (fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function'
}
