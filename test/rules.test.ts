import { describe, expect, it } from 'vitest'
import betweenValidator from '../src/runtime/rules/between'
import emailValidator from '../src/runtime/rules/email'
import confirmedValidator from '../src/runtime/rules/confirmed'
import requiredValidator from '../src/runtime/rules/required'

describe('Validation rules', async () => {
  // Between rule
  it('Between should be true', function () {
    const valid = betweenValidator(10, { min: 1, max: 20 })
    expect(valid).toBe(true)
  })
  it('Between should be false', function () {
    const valid = betweenValidator(0, { min: 1, max: 20 })
    expect(valid).toBe(false)
  })

  // Email rule
  it('Email "test@example.com" should be true', function () {
    const valid = emailValidator('test@example.com')
    expect(valid).toBe(true)
  })
  it('Email "notanemail" should be false', function () {
    const valid = emailValidator('notanemail')
    expect(valid).toBe(false)
  })
  it('Email "notanemail@" should be false', function () {
    const valid = emailValidator('notanemail@')
    expect(valid).toBe(false)
  })

  // Confirmed rule
  it('Confirmed should be true', function () {
    const valid = confirmedValidator('test', { comparative: 'test' })
    expect(valid).toBe(true)
  })
  it('Confirmed should be false', function () {
    const valid = confirmedValidator('test', { comparative: 'test2' })
    expect(valid).toBe(false)
  })

  // Required rule
  it('Required should be true if value is "test"', function () {
    const valid = requiredValidator('test')
    expect(valid).toBe(true)
  })
  it('Required should be false if value is "undefined", "null" or an empty string', function () {
    expect(requiredValidator(undefined)).toBe(false)
    expect(requiredValidator(null)).toBe(false)
    expect(requiredValidator('')).toBe(false)
  })
})