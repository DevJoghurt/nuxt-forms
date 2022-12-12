import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addComponent, addImports, addTemplate } from '@nuxt/kit'
import { generateLocalesImports } from './templates'
import type { Locale } from './runtime/types'

export interface ModuleOptions {
  locales: Locale[] | false
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
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    locales: ['en'],
    security: {
      csrf: false
    }
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // add options to public runtime
    nuxt.options.runtimeConfig.public.forms = {
      locales: options.locales,
      csrf: options.security.csrf
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)

    addImports([{
      from: resolve(runtimeDir, 'composables/useForm'),
      name: 'useForm'
    }, {
      from: resolve(runtimeDir, 'composables/useField'),
      name: 'useField'
    }, {
      from: resolve(runtimeDir, 'composables/useValidation'),
      name: 'useValidation'
    }])
    addComponent({
      name: 'NuxtForm',
      filePath: `${resolve(runtimeDir, 'components')}/nuxt-form.vue`
    })
    addComponent({
      name: 'Field',
      filePath: `${resolve(runtimeDir, 'components')}/field.vue`
    })

    addTemplate({
      write: true,
      filename: 'form.imports.ts',
      getContents() { 
        return generateLocalesImports(options.locales)
      }
    })

  }
})
