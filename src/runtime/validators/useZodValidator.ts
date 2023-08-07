import { z } from 'zod'
import { getValueByProperty } from '../utils/getValueByProperty'
import { ValidatorAdapter, ValidateResult, ValidationType, ValidationParams } from '../types'

/**
 * @summary Function returns default object from Zod schema
 * @version 23.05.15.2
 * @link https://gist.github.com/TonyGravagno/2b744ceb99e415c4b53e8b35b309c29c
 * @author Jacob Weisenburger, Josh Andromidas, Thomas Moiluiavon, Tony Gravagno
 * @param schema z.object schema definition
 * @param options Optional object, see Example for details
 * @returns Object of type schema with defaults for all fields
 * @example
 * const schema = z.object( { ... } )
 * const default1 = defaultInstance<typeof schema>(schema)
 * const default2 = defaultInstance<typeof schema>(
 *   schema,{ // toggle from these defaults if required
 *     arrayEmpty: false,
 *     dateEmpty: false,
 *     dateUndefined: false,
 *     dateNull: false,
 * } )
 */

type FallbackStrategy = {
    arrayEmpty?: boolean
    dateEmpty?: boolean
    dateUndefined?: boolean
    dateNull?: boolean
}

function getDefaults<T extends z.ZodTypeAny> (
  schema: z.AnyZodObject | z.ZodEffects<any> | z.ZodDefault<z.AnyZodObject | z.ZodString>,
  fallbackDefaults: FallbackStrategy = {}
): z.infer<T> {
  const {
    arrayEmpty = false,
    dateEmpty = false,
    dateUndefined = false,
    dateNull = false
  } = fallbackDefaults

  function defaultInstance (
    schema: z.AnyZodObject | z.ZodEffects<any>
  ): z.infer<T> {
    function run (): z.infer<T> {
      if (schema instanceof z.ZodEffects) {
        if (schema.innerType() instanceof z.ZodEffects) {
          return defaultInstance(schema.innerType()) // recursive ZodEffect
        }
        // return schema inner shape as a fresh zodObject
        return defaultInstance(z.ZodObject.create(schema.innerType().shape))
      }
      if (schema instanceof z.ZodType && schema instanceof z.ZodObject) {
        const currentShape = schema.shape as z.ZodAny // eliminates 'undefined' issue
        const entries = Object.entries(currentShape)
        const temp = entries.map(([key, value]) => {
          const currentDefault =
              value instanceof z.ZodEffects ? defaultInstance(value) : getDefaultValue(value)
          return [key, currentDefault]
        })
        return Object.fromEntries(temp)
      } else {
        return null // unknown or undefined here results in complications
      }

      function getDefaultValue (dschema: z.ZodTypeAny): any {
        if (typeof dschema === 'undefined') { return undefined }
        if (dschema instanceof z.ZodDefault) {
          if (!('_def' in dschema)) { return undefined } // error
          if (!('defaultValue' in dschema._def)) { return undefined } // error
          return dschema._def.defaultValue()
        }
        if (dschema instanceof z.ZodArray) {
          if (!('_def' in dschema)) { return undefined } // error
          if (!('type' in dschema._def)) { return undefined } // error
          // return empty array or array with one empty typed element
          return arrayEmpty ? [] : [getDefaultValue(dschema._def.type as z.ZodAny)]
        }
        if (dschema instanceof z.ZodString) { return '' }
        if (dschema instanceof z.ZodNumber || dschema instanceof z.ZodBigInt) {
          const value = dschema.minValue ?? 0
          return value
        }
        if (dschema instanceof z.ZodDate) {
          const value = dateEmpty
            ? ''
            : dateNull
              ? null
              : dateUndefined
                ? undefined
                : (dschema as z.ZodDate).minDate
          return value
        }
        if (dschema instanceof z.ZodSymbol) { return '' }
        if (dschema instanceof z.ZodBoolean) { return false }
        if (dschema instanceof z.ZodNull) { return null }
        if (dschema instanceof z.ZodPipeline) {
          if (!('out' in dschema._def)) { return undefined } // error
          return getDefaultValue(dschema._def.out)
        }
        if (dschema instanceof z.ZodObject) {
          return defaultInstance(dschema)
        }
        if (dschema instanceof z.ZodAny && !('innerType' in dschema._def)) { return undefined } // error?
        return getDefaultValue(dschema._def.innerType)
      }
    }
    return run()
  }
  if (schema instanceof z.ZodDefault) {
    return schema._def?.defaultValue() || null
  } else {
    return defaultInstance(schema)
  }
}

type UseZodValidatorOptions = {
  parseDefaults?: boolean
  fallbackStrategy?: FallbackStrategy
}

export function useZodValidator (schema: z.AnyZodObject | z.ZodEffects<any> | z.ZodDefault<z.AnyZodObject | z.ZodString>, options: UseZodValidatorOptions = {}): ValidatorAdapter<ValidationType> {
  const { parseDefaults = false, fallbackStrategy = {} } = options

  let defaultData: any = null

  if (parseDefaults) {
    try {
      defaultData = getDefaults(schema, fallbackStrategy)
    } catch (e) {
      console.log('error', e)
    }
  }

  const validate = async (validationType: ValidationType, data: any, params: ValidationParams | undefined): Promise<ValidateResult<ValidationType>> => {
    if (validationType === 'field' && params?.field) {
      data = getValueByProperty(data, params.field, null)
    }
    const result = await schema.safeParseAsync(data)

    let error = null
    if (validationType === 'form') {
      error = result.success
        ? {}
        : result.error.issues.reduce<any>((errors, error) => {
          const path = error.path.join('.')
          if (!errors[path]) {
            errors[path] = error.message
          }
          return errors
        }, {})
    }
    if (validationType === 'field') {
      error = result.success ? '' : result.error.issues[0].message
    }

    return {
      success: result.success,
      error
    }
  }

  return {
    type: 'zod',
    initialData: defaultData,
    validate
  }
}
