import { getValueByProperty } from "./getValueByProperty"
/**
 * Replaces placeholder values in a string with their actual values
 */
export function interpolate(template: string, values: Record<string, any>): string {
    return template.replace(/\{([^{}\[\]]+)\}/g, function (_, placeholder): string {
        return String(getValueByProperty(values, placeholder))
    });
}