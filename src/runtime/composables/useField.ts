import { reactive, inject, onMounted, onBeforeUnmount, toRefs, isRef } from '#imports'
import { 
  getValueByProperty, 
  interpolate, 
  isCallable, 
  isSchemaValidationError, 
  isSchemaValidationSuccess } from '../utils/helpers'
import { FormContextKey } from '../utils/symbols'
import { klona } from 'klona/lite'
import type { FieldOptions, FieldData, FormContext, ValidationRule } from '../types'


export function useField (name: string,options: FieldOptions) {
    const formContext = inject<FormContext>(FormContextKey)
  
    const fieldData = reactive({
      valid: true,
      updated: false,
      errors: [],
      value: null
    }) as FieldData

    let initialData = options.initialData ? (isRef(options.initialData) ? options.initialData.value : options.initialData) : null

    /** 
     * init form schema validatio
     * if field schema is defined get default value from schema if available
    */
    if(options.schema){
      const fieldSchemaValidation = options.schema.safeParse(undefined)
      if(fieldSchemaValidation.success){
        initialData = fieldSchemaValidation.data
      }
    }

    const validate = async () => {
      //reset field errors
      fieldData.errors = []

      // field based schema validation
      if(options.schema){
        const schemaValidation = options.schema.safeParse(fieldData.value)
        if(isSchemaValidationError(schemaValidation)){
          fieldData.valid = false
          for(const error of schemaValidation.error.errors){
            fieldData.errors.push(error.message)
          }
        }else if(isSchemaValidationSuccess(schemaValidation)){
          fieldData.valid = true
          // overwrite field value with schema data -> this is because zod can transform data
          fieldData.value = schemaValidation.data
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
          }else if(fieldData.errors.length === 0){
            fieldData.valid = true
          }
        }
      }
  
      return fieldData.valid
    }
  
    const updateValue = (value: any) => {
      fieldData.updated = true
      fieldData.value = value
      // TODO: add debounce
      if(options.validateOnChange){
        if(formContext?.isFormValidation){
          formContext.validate()
        }else{
          validate()
        }
      }else{
        fieldData.valid = true
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
  