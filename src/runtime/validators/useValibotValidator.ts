import { getValueByProperty } from '../utils/getValueByProperty'
import { BaseSchema, BaseSchemaAsync, safeParseAsync } from 'valibot';
import { ValidatorAdapter, ValidateResult, ValidationType, ValidationParams, FormValues } from '../types'

export function useValibotValidator(schema: BaseSchema<FormValues, any> | BaseSchemaAsync<FormValues, any>): ValidatorAdapter<ValidationType> {
    
    // TODO: get default data from schema
    const defaultData: any = null

    const validate = async (validationType:  ValidationType, data: any, params: ValidationParams | undefined): Promise<ValidateResult<ValidationType>> => {
        if(validationType === 'field' && params?.field){
            data = getValueByProperty(data, params.field, null)
        }
        const result = await safeParseAsync(schema, data, {
            abortPipeEarly: true,
        })

        let error = null
        if(validationType === 'form') {
          error = result.success ? {} : result.error.issues.reduce<any>(
            (errors, issue) => ({
              ...errors,
              [issue.path!.map(({ key }) => key).join('.')]: issue.message,
            }),
            {}
          );
        }
        if(validationType === 'field') {
          error = result.success ? '' : result.error.message
        }

        return {
            success: result.success,
            error
        }
    }

    return {
        type: 'valibot',
        initialData: defaultData,
        validate
    }
}
