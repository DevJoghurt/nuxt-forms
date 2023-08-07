import { createObjectValueByKey } from '../utils/createObjectValueByKey'
import { getValueByProperty } from '../utils/getValueByProperty'
import { interpolate } from '../utils/interpolate'
import { transformValidator } from '../utils/transformValidator'
import type { FieldOptions, FieldData, FormContext, FieldContext, FormValues } from '../types'
import { reactive, toRefs, unref, toRaw } from '#imports'

export function useField (name: string, options: FieldOptions) {
  const {
    label = null,
    bindFormData = false
  } = options || {}

  let formContext = null as FormContext | null

  const fieldData = reactive({
    valid: true,
    updated: false,
    errors: [],
    value: null
  }) as FieldData

  const fieldValidation = transformValidator('field', options.validate)
  // set initial field data or field validation defaults
  let initialData = options.initialData ? unref(options.initialData) : fieldValidation.initialFieldData

  // Create field context
  const fieldContext = {
    // Field name
    name,
    // Field label
    label,
    /**
     * Internal function to set Errors to field
     * @returns
     */
    setError: (error: string) => {
      fieldData.errors.push(error)
      fieldData.valid = false
    },
    /**
     * Internal function to set field as valid
     * @returns
     */
    setValid: (valid: boolean) => {
      fieldData.valid = valid
    },
    /**
     * Internal function to get field data
     * @returns
     */
    getData: () => {
      return fieldData.value
    },
    /**
     * Internal function to validate field and return field data
     * @returns copy of fieldData
     **/
    validate: async () => {
      await validate()
      // return a non reactive copy of field data
      const rawFieldData = toRaw(fieldData)
      return structuredClone(rawFieldData)
    },
    /**
     * Internal function to initialize field data from form initial data
     * @param formInitialData
     */
    initializeData: (formInitialData: any) => {
      if (!initialData && formInitialData !== null) {
        fieldData.value = getValueByProperty(formInitialData, name, null)
        initialData = fieldData.value
      } else {
        fieldData.value = initialData
      }
    },
    /**
     * Internal function to reset field data
     * @returns
     * */
    reset: () => {
      fieldData.updated = false
      fieldData.value = initialData
      fieldData.valid = true
      fieldData.errors = []
    }
  } as FieldContext

  const validate = async () => {
    // reset field errors
    fieldData.errors = []
    fieldData.valid = true

    let formData = {} as FormValues
    let flattenedData = {} as FormValues
    if (bindFormData && formContext) {
      const tmpData = formContext.getData()
      formData = tmpData.data
      flattenedData = tmpData.flattenedData
    } else {
      createObjectValueByKey(formData, name, fieldData.value)
      flattenedData[name] = fieldData.value
    }

    if (fieldValidation.isValidator) {
      for (const validation of fieldValidation.validations) {
        const result = await validation.validate('field', formData, {
          field: name
        })
        if (result.success === false) {
          fieldData.valid = false
          if (result.error) {
            // interpolate error message
            const error = interpolate(result.error, {
              ...flattenedData,
              ...validation?.params,
              fieldLabel: label || name,
              fieldName: name
            })
            fieldData.errors.push(error)
          }
        }
      }
    }

    return fieldData.valid
  }

  const updateValue = async (value: any) => {
    fieldData.updated = true
    fieldData.value = value

    // TODO: check if debounce is needed
    if (options.validateOnChange) {
      if (formContext?.isFormValidation || (formContext && options.validateOnChange === 'form')) {
        await formContext.validate(options?.validateOnChange !== 'form' ? name : null)
      } else {
        await validate()
      }
    } else {
      fieldData.valid = true
    }
    // trigger onValidate callback
    if (options.onValidate) {
      options.onValidate(value)
    }
  }

  const bindForm = (form: FormContext | null) => {
    if (form) {
      formContext = form
      formContext.register(fieldContext)
    }
  }

  const unbindForm = () => {
    if (formContext) {
      formContext.unregister(name)
      formContext = null
    }
  }

  return {
    ...toRefs(fieldData),
    validate,
    bindForm,
    unbindForm,
    updateValue
  }
}
