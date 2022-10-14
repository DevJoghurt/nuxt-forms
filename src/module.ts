import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'
import type { I18nLocales } from './runtime/utils/locales'

export interface ModuleOptions {
  lang: I18nLocales
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'simple-forms',
    configKey: 'simpleforms',
    compatibility: {
      nuxt: '^3.0.0-rc.3'
    }
  },
  defaults: {
    lang: 'en'
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    const { lang } = options
    nuxt.options.runtimeConfig.public.simpleforms = { lang }

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)

    addImports({
      from: resolve(runtimeDir, 'composables/form.ts'),
      name: 'useForm'
    })
    addImports({
      from: resolve(runtimeDir, 'composables/form.ts'),
      name: 'useFormChild'
    })
    addComponent({
      name: 'SimpleForm',
      filePath: `${resolve(runtimeDir, 'components')}/simple-form.vue`
    })
    addComponent({
      name: 'FormChild',
      filePath: `${resolve(runtimeDir, 'components')}/form-child.vue`
    })
  }
})
