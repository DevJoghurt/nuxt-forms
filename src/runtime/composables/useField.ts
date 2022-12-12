import { reactive, inject, onMounted, onBeforeUnmount, toRefs, isRef } from '#imports'
import { getValueByProperty, createObjectValueByKey, interpolate, isCallable } from '../utils/helpers'
import { FormContextKey } from '../utils/symbols'
import { klona } from 'klona/lite'
import type { FieldOptions, FieldData, FormContext, ValidationRule } from '../types'
import { ZodTypeAny } from 'zod'


export function useField (name: string,options: FieldOptions) {
    const formContext = inject<FormContext>(FormContextKey)
  
    const fieldData = reactive({
      valid: true,
      updated: false,
      errors: [],
      value: null
    }) as FieldData

    let initialData = options.initialData ? (isRef(options.initialData) ? options.initialData.value : options.initialData) : null

    // init form schema validation
    let formFieldSchema = null as ZodTypeAny | null
    const formObjectField = {}
    if(formContext?.schema){
      createObjectValueByKey(formObjectField, name, true)
      // @ts-ignore
      formFieldSchema  = formContext.schema.pick(formObjectField)
    }
    // if field schema is defined get default value from schema if available
    if(options.schema){
      const fieldSchemaValidation = options.schema.safeParse(undefined)
      if(fieldSchemaValidation.success){
        initialData = fieldSchemaValidation.data
      }
    }

    const validate = async () => {
      //reset field data
      fieldData.valid = true
      fieldData.errors = []

      //form based schema validation
      if(formFieldSchema){
        // add field value to form validation object
        createObjectValueByKey(formObjectField, name, fieldData.value)
        const schemaValidation = formFieldSchema.safeParse(formObjectField)
        if(!schemaValidation.success && !schemaValidation.error.isEmpty){
          fieldData.valid = false
          for(const error of schemaValidation.error.errors){
            fieldData.errors.push(error.message)
          }
        }
      }

      // field based schema validation
      if(options.schema){
        const schemaValidation = options.schema.safeParse(fieldData.value)
        if(!schemaValidation.success && !schemaValidation.error.isEmpty){
          fieldData.valid = false
          for(const error of schemaValidation.error.errors){
            fieldData.errors.push(error.message)
          }
        }
      }

      // rule based validation
      if(options.rules){
        for(const rule of options.rules){
          let validatationRule = rule
          if(isCallable(validatationRule)){
            validatationRule = validatationRule() as ValidationRule
          }
          const isValidOrError = await validatationRule.validate(fieldData.value, validatationRule?.params)
          if(!isValidOrError || typeof isValidOrError === 'string'){
            fieldData.valid = false
            const message = interpolate(validatationRule?.errorMessage || isValidOrError.toString(), { ...validatationRule?.params, field: options?.label || name })
            fieldData.errors.push(message)
          }
        }
      }
  
      return fieldData.valid
    }
  
    const updateValue = (value: any) => {
      fieldData.valid = true
      fieldData.updated = true
      fieldData.value = value
      // validate field if validateOnChange is true
      // TODO: add debounce
      if(options.validateOnChange){
        validate()
      }
      // trigger onValidate callback
      if(options.onValidate){
        options.onValidate(value)
      }
    }

    onMounted(() => {
      if (formContext) {
        formContext.bind({
          name,
          /**
           * Internal function to validate field and return field data
           * @returns copy of fieldData
           **/
          validate: async () => {
            await validate()
            // return a non reactive copy of field data
            return klona(fieldData)
          },
          /**
           * Internal function to initialize field data from form initial data
           * @param formInitialData 
           */
          initializeData: (formInitialData: any) => {
            if ( !initialData && formInitialData !== null) {
              fieldData.value = getValueByProperty(formInitialData, name, null)
            }else{
              fieldData.value = initialData
            }
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
  