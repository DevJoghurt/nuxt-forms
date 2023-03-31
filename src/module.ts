import { defineNuxtModule, createResolver, addComponent, addImports, addTemplate } from '@nuxt/kit'
import { generateLocalesImports } from './templates'
import type { Locale } from './runtime/types'

export interface ModuleOptions {
  locales: Locale[] | false

  /**
   * Register components globally
   * @default true
   * @type {boolean}
   */
  registerComponents: boolean
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
    registerComponents: true,
    security: {
      csrf: false
    }
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = './runtime'

    // add options to public runtime
    nuxt.options.runtimeConfig.public.forms = {
      locales: options.locales,
      csrf: options.security.csrf
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports([{
      from: resolve('runtime/composables/useForm'),
      name: 'useForm'
    }, {
      from: resolve('runtime/composables/useField'),
      name: 'useField'
    }, {
      from: resolve('runtime/composables/useValidation'),
      name: 'useValidation'
    }])
    
    if(options.registerComponents){
      addComponent({
        name: 'NuxtForm',
        filePath: resolve('runtime/components/nuxt-form.vue')
      })
      addComponent({
        name: 'Field',
        filePath: resolve('runtime/components/field.vue')
      })
    }

    addTemplate({
      write: true,
      filename: 'form.imports.ts',
      getContents() { 
        return generateLocalesImports(options.locales)
      }
    })

  }
})
