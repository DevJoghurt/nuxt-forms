import {
  getValueByProperty,
  interpolate,
  isCallable,
  isSchemaValidationError,
  isSchemaValidationSuccess
} from '../utils/common'
import { FormContextKey } from '../utils/symbols'
import type { FieldOptions, FieldData, FormContext, ValidationRule } from '../types'
import { reactive, inject, onMounted, onBeforeUnmount, toRefs, isRef, toRaw } from '#imports'

export function useField (name: string, options: FieldOptions) {
  const formContext = inject<FormContext>(FormContextKey) || null as FormContext | null

  const fieldData = reactive({
    valid: true,
    updated: false,
    errors: [],
    value: null
  }) as FieldData

  let initialData = options.initialData ? (isRef(options.initialData) ? options.initialData.value : options.initialData) : null

  const validate = async () => {
    // reset field errors
    fieldData.errors = []

    // field based schema validation
    if (options.schema) {
      const schemaValidation = options.schema.safeParse(fieldData.value)
      if (isSchemaValidationError(schemaValidation)) {
        fieldData.valid = false
        for (const error of schemaValidation.error.errors) {
          // TODO: add error message interpolation
          const message = interpolate(error.message, { ...{}, field: options?.label || name })
          fieldData.errors.push(message)
        }
      } else if (isSchemaValidationSuccess(schemaValidation)) {
        fieldData.valid = true
        // overwrite field value with schema data -> this is because zod can transform data
        fieldData.value = schemaValidation.data
      }
    }

    // rule based validation
    if (options.rules) {
      let formData = null as any
      // formData is null if form is not binded
      if (options?.bindFormData && formContext) {
        formData = formContext.getData()
      }
      for (const rule of options.rules) {
        let validatationRule = rule
        if (isCallable(validatationRule)) {
          validatationRule = validatationRule() as ValidationRule
        }
        const isValidOrError = await validatationRule.validate(fieldData.value, validatationRule?.params, formData)
        if (!isValidOrError || typeof isValidOrError === 'string') {
          fieldData.valid = false
          const errorMessage = validatationRule?.errorMessage || isValidOrError.toString()
          const message = interpolate(errorMessage, { params: validatationRule?.params, field: options?.label || name })
          fieldData.errors.push(message)
        } else if (fieldData.errors.length === 0) {
          fieldData.valid = true
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
        await formContext.validate(name)
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

  onMounted(() => {
    if (formContext) {
      formContext.bind({
        name,
        /**
         * Internal function to set Errors to field
         * @returns
         */
        setErrors: (errors: string[]) => {
          fieldData.errors = fieldData.errors.concat(errors)
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
      })
    }
  })

  onBeforeUnmount(() => {
    if (formContext) {
      formContext.unbind(name)
    }
  })

  return {
    ...toRefs(fieldData),
    validate,
    updateValue
  }
}
