/**
 *
 * Check if a value is empty
 *
 * @param value
 * @returns boolean
 */

export default function isEmpty (value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  return false
}
