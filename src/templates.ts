import { genImport, genArrayFromRaw } from 'knitwork'
import type { Locales } from './types'

export function generateLocalesImports(locales: Locales[] = ['en']) {
    let template = ''
    locales.map(locale => template += genImport(`@vee-validate/i18n/dist/locale/${locale}.json`, locale))
    template += `
export function getFormLocales() {
    return ${genArrayFromRaw(locales)}
}`
    return template
}