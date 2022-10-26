import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'
import type { I18nLocales } from './runtime/utils/locales'

export interface ModuleOptions {
  lang: I18nLocales
  /**
  * Add form based security features to your Nuxt app
  */
  security: {
    /**
     * Enable CSRF protection
     */
    csrf: false | {
      cookieName: string,
      paramName: string,
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-forms',
    configKey: 'forms',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },
  defaults: {
    lang: 'en',
    security: {
      csrf: false
    }
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // add options to public runtime
    nuxt.options.runtimeConfig.public.forms = {
      lang: options.lang,
      csrf: options.security.csrf
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)

    addImports([{
      from: resolve(runtimeDir, 'composables/form.ts'),
      name: 'useForm'
    }, {
      from: resolve(runtimeDir, 'composables/form.ts'),
      name: 'useFormChild'
    }])
    addComponent({
      name: 'NuxtForm',
      filePath: `${resolve(runtimeDir, 'components')}/nuxt-form.vue`
    })
    addComponent({
      name: 'FormChild',
      filePath: `${resolve(runtimeDir, 'components')}/form-child.vue`
    })
  }
})
