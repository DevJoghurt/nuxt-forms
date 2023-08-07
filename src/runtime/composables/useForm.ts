import { FormContextKey } from '../utils/symbols'
import { createObjectValueByKey } from '../utils/createObjectValueByKey'
import { getValueByProperty } from '../utils/getValueByProperty'
import { transformValidator } from '../utils/transformValidator'
import { interpolate } from '../utils/interpolate'
import type { FormOptions, FieldContext, FormContext, FormData, FormFields, FieldData, FormValues } from '../types'
import { defu } from 'defu'
import { provide, reactive, toRefs, unref, toRaw } from '#imports'

export function useForm (options: FormOptions) {
  const registeredFields = reactive([]) as FieldContext[]

  const formData = reactive<FormData>({
    updated: false,
    valid: false,
    errors: [],
    value: {}
  })

  const formValidation = transformValidator('form', options.validate)
  // merge initial form data and form validation defaults
  const initialData = defu(options.initialData ? unref(options.initialData) : {}, ...formValidation.initialFormData)

  const register = (field: FieldContext) => {
    field.initializeData(initialData)
    registeredFields.push(field)
  }

  const unregister = (name: string) => {
    const index = registeredFields.findIndex(field => field.name === name)
    if (index > -1) {
      registeredFields.splice(index, 1)
    }
  }

  const validate = async (fieldName: string | null = null) => {
    const formFields = {} as FormFields
    const flattenedFields = {} as FormValues
    // reset form data
    formData.valid = true
    formData.updated = true
    formData.errors = []

    // validate fields and create form data
    for (const field of registeredFields) {
      if (fieldName && fieldName !== field.name) { continue }
      const fieldData = await field.validate()
      if (!fieldData.valid) {
        formData.valid = false
      }
      /**
       * Create objects
       */
      // add field values to formData
      createObjectValueByKey(formData.value, field.name, fieldData.value)
      // add field errors to formData
      formData.errors = formData.errors.concat(fieldData.errors)
      // add all field data to formFields
      createObjectValueByKey(formFields, field.name, fieldData)
      // create a flatten object of all fields
      flattenedFields[field.name] = fieldData
    }



    // form validate if validators are defined
    if (formValidation.isValidator) {
      for(const validation of formValidation.validations) {
        const result = await validation.validate('form', formData.value)
        if (result.success === false) {
          formData.valid = false
          for (const field of registeredFields) {
            if (fieldName && fieldName !== field.name) { continue }
            if(typeof result.error[field.name] !== 'undefined') {
              // interpolate error message
              const error = interpolate(result.error[field.name],{
                ...flattenedFields,
                fieldLabel: field.label,
                fieldName: field.name
              })
              formData.errors.push(error)
              field.setError(error)
              // add error to field data
              const currentField = getValueByProperty<FieldData>(formFields, field.name)
              currentField.errors.push(error)
              currentField.valid = false
            }
          }
        }
      }
    }

    // return a non reactive copy of formData and formFields
    const rawFormData = structuredClone(toRaw(formData))
    return {
      ...rawFormData,
      fields: formFields
    }
  }

  const getData = () => {
    const data = {} as FormValues
    const flattenedData = {} as FormValues
    for (const field of registeredFields) {
      const fieldData = field.getData()
      createObjectValueByKey(data, field.name, fieldData)
      flattenedData[field.name] = fieldData
    }
    return {
      data,
      flattenedData
    }
  }

  const reset = () => {
    for (const field of registeredFields) {
      field.reset()
    }
  }

  const formContext = {
    isFormValidation: formValidation.isValidator,
    getData,
    validate,
    register,
    unregister
  } as FormContext

  provide<FormContext>(FormContextKey, formContext)

  const initializeData = (data: unknown) => {
    const initialData = data ? Object.assign({}, data) : null
    for (const field of registeredFields) {
      field.initializeData(initialData)
    }
  }

  const handleSubmit = async () => {
    const result = await validate()
    if (result.valid) {
      // clear form data
      if (options.clearOnSubmit) {
        initializeData({})
      }
    }
    return result
  }

  return {
    ...toRefs(formData),
    form: formContext,
    initializeData,
    handleSubmit,
    reset
  }
}