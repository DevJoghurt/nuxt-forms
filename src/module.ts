import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'
import { extendBundler } from './bundler'

export interface ModuleOptions {
  /**
   * Register components
   * @default true
   * @type {boolean}
   */
  registerComponents: boolean

  /**
   * Auto import rules
   * @default true
   * @type {boolean}
   */
  autoImportRules?: boolean
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
    registerComponents: true,
    autoImportRules: true
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    const validators = ['zod', 'valibot', 'rule', 'custom']

    for (const validator of validators) {
      const validatorName = `use${validator.charAt(0).toUpperCase()}${validator.slice(1)}Validator`
      addImports([{
        from: resolve(`runtime/validators/${validatorName}`),
        name: validatorName
      }])
    }

    addImports([{
      from: resolve('runtime/composables/useForm'),
      name: 'useForm'
    }, {
      from: resolve('runtime/composables/useField'),
      name: 'useField'
    }, {
      from: resolve('runtime/composables/useFormSubmit'),
      name: 'useFormSubmit'
    }, {
      from: resolve('runtime/composables/useFormContext'),
      name: 'useFormContext'
    }])

    if (options.autoImportRules) {
      const rules = [
        'between',
        'email',
        'confirmed',
        'required',
        'tel',
        'equalToField'
      ]
      rules.forEach((rule) => {
        addImports([{
          from: resolve(`runtime/rules/${rule}`),
          name: 'default',
          as: `${rule}Rule`
        }])
      })
      extendBundler(rules)
    }

    if (options.registerComponents) {
      addComponent({
        name: 'NuxtForm',
        filePath: resolve('runtime/components/nuxt-form.vue')
      })
      addComponent({
        name: 'Field',
        filePath: resolve('runtime/components/field.vue')
      })
    }
  }
})
