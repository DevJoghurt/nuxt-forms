import { createUnplugin } from 'unplugin'
import { addVitePlugin } from '@nuxt/kit'

type PluginOptions = {
    allowedRules: string[]
}

export function extendBundler (validatorRules: string[]) {
  addVitePlugin(ThemeImportPlugin.vite({
    allowedRules: validatorRules
  }))
}

/*
* This plugin is used to automatically import the validator rules
* when the useRuleValidator function is used with an allowed rule.
*/
const ThemeImportPlugin = createUnplugin((options: PluginOptions) => {
  return {
    name: 'form-validator-import',
    enforce: 'pre',
    transform (code) {
      if (!code.includes('useRuleValidator')) {
        return null
      }

      let autoImportAdded = false as boolean;
      const updatedCode = code.replace(
          /useRuleValidator\(([^,]*?)(?:,\s*({(?:[^{}]*|\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})*}))?\)/g, 
          (match, arg1, arg2) => {
          const phrase = arg1.slice(1, -1)
          if(options.allowedRules.includes(phrase)){
            autoImportAdded = true
            return `useRuleValidator('${phrase}'${arg2 ? ', ' + arg2.trim() : ',{} '}, ${phrase}Rule)`
          }else{
            return match
          }
      }) 

      if (autoImportAdded) {
        return {
          code: updatedCode,
          map: null
        }
      }

      return null
    }
  }
})
