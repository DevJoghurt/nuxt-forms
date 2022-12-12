import { provide, reactive, toRefs, isRef, onMounted } from '#imports'
import { FormContextKey } from '../utils/symbols'
import { createObjectValueByKey } from '../utils/helpers'
import { klona } from 'klona/lite'
import type { FormOptions, FieldContext, FormContext, FormData, FormFields } from '../../types'


export function useForm (options: FormOptions) {
  const registeredFields = reactive([]) as FieldContext[]

  const formData = reactive<FormData>({
    valid: false,
    errors: [],
    value: {}
  })

  let initialData = options.initialData ? Object.assign({}, isRef(options.initialData) ? options.initialData.value : options.initialData ) : {}
  //if schema is defined, validate schema with initial data -> this will add default values to initial data
  if(options.schema){
      const schemaDefaultData = options.schema.optional().safeParse(initialData)
      if(schemaDefaultData.success){
        initialData = Object.assign({}, schemaDefaultData.data)
      }
  }

  const bind = (field: FieldContext) => {
    field.initializeData(initialData)
    registeredFields.push(field)
  }

  const unbind = (name: string) => {
    const index = registeredFields.findIndex(field => field.name === name)
    if (index > -1) {
      registeredFields.splice(index, 1)
    }
  }

  provide<FormContext>(FormContextKey, {
    schema: options.schema,
    bind,
    unbind
  })


  const validate = async () => {
    const formFields = {} as FormFields
    //reset form data
    formData.valid = true
    formData.errors = []
    // validate fields
    for (const field of registeredFields) {
      const fieldData = await field.validate()
      if (!fieldData.valid) {
        formData.valid = false
      }
      /**
       * Create objects
       */
      //add field values to formData
      createObjectValueByKey(formData.value, field.name, fieldData.value)
      //add field errors to formData
      formData.errors = formData.errors.concat(fieldData.errors)
      //add all field data to formFields
      createObjectValueByKey(formFields, field.name, fieldData)
    }


    //return a non reactive copy of formData and formFields
    return {
      ...klona(formData),
      fields: formFields
    }
  }

  const initializeData = (data: unknown) => {
    const initialData = data ? Object.assign({}, data) : null
    for (const field of registeredFields) {
      field.initializeData(initialData)
    }
  }

  const handleSubmit = async () => {
    const result = await validate()
    console.log(result)
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
    initializeData,
    validate,
    handleSubmit
  }
}
