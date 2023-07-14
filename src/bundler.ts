import { createUnplugin } from 'unplugin'
import { addVitePlugin } from '@nuxt/kit'

type PluginOptions = {
    allowedRules: string[]
}

export async function extendBundler(validatorRules: string[]) {
    addVitePlugin(ThemeImportPlugin.vite({
        allowedRules: validatorRules
    }))
}

/*
* This plugin is used to automatically import the validator rules
* when the useValidation function is used with an allowed rule.
*/
const ThemeImportPlugin = createUnplugin((options: PluginOptions, meta) => {
    return {
        name: 'form-validator-import',
        enforce: 'pre',
        async transform(code, id) {
          if (!code.includes('useValidation')) {
              return null;
          }

          let autoImportAdded = false as boolean;
          const updatedCode = code.replace(
            /useValidation\(\s*((?:(?:function\s*\([\w\s,$]*\)|\([\w\s,$]*\))|[\w$]+)\s*\([^)]*\)|\([^)]*\)|[^,)]+?|\(\))\s*,\s*(['"`][^'"]*['"`])\s*\)/g, 
            (match, arg1, arg2) => {
            const phrase = arg1.slice(1, -1)
            if(options.allowedRules.includes(phrase)){
              autoImportAdded = true
              return `useValidation(${phrase}Validator${arg2 ? ', ' + arg2.trim() : ''})`
            }else{
              return match
            }
          })          
        
          if (autoImportAdded) {
            return {
              code: updatedCode ,
              map: null,
            };
          }
      
          return null;
        }
    }
})