import { genImport, genArrayFromRaw } from 'knitwork'
import type { Locale } from './runtime/types'

export function generateLocalesImports(locales: Locale[] | false = ['en']) {
    let template = ''
    if(locales) locales.map(locale => template += genImport(`@vee-validate/i18n/dist/locale/${locale}.json`, locale))
    template += `
export function getFormLocales() {
    return ${locales ? genArrayFromRaw(locales) : '[{ code: "", messages: {} }]'} as LocaleObject[]
}`
    return template
}