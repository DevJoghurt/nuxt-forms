import { provide, reactive, inject, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { useFormLocale } from '../utils/locales'
import { useRules } from '../utils/rules'
import type { LocaleTypes } from '../utils/locales'
import type { RulesetTypes, Rule } from '../utils/rules'

export type SubmitResult = {
    valid: boolean
}

export type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: SubmitResult, dataPassThrough: any): void
}

export type FormProps = {
  lang?: 'en' | 'de' | 'es' | 'fr' | 'it',
  locales?: LocaleTypes,
  modelValue?: object | null
}

export type FormChildProps = {
  name?: string,
  rules?: (RulesetTypes|Rule)[] | RulesetTypes,
  modelValue?: any
}

type Data = {
  valid: boolean,
  updated: boolean,
  error: string | null,
  value: any
}

/*
* Get the model value by property
*/
export function getModelValueByProperty<Object> (modelValue: Object, name: String, defaultValue = null) {
  const value = name.split('.').reduce((o, k) => (o || {})[k], modelValue)
  if (typeof value === 'undefined') { return defaultValue } else { return value }
}

export function useForm (props: FormProps, emits: FormEmits) {
  let dataPassThrough = null

  const formState = reactive({
    components: []
  })
  const isFormModelValue = !!props.modelValue

  const bind = (component) => {
    const modelValue = isFormModelValue ? Object.assign({}, props.modelValue) : null
    component.initData(modelValue)
    formState.components.push(component)
  }
  const unbind = (uid) => {
    const index = formState.components.findIndex(c => c.uid === uid)
    if (index > -1) {
      formState.components.splice(index, 1)
    }
  }

  const { getLocale, addLocales } = useFormLocale()

  if (props.locales) {
    addLocales(props.locales)
  }

  const locales = getLocale(props.lang)

  provide('form', {
    bind,
    unbind,
    locales
  })

  let modelValueResult = {}

  const createObject = function (obj, key, value) {
    const pathArr = key.split('.')
    // eslint-disable-next-line
    for (var i = 0, tmp = obj; i < pathArr.length - 1; i++) {
      if (typeof tmp[pathArr[i]] === 'undefined') {
        tmp = tmp[pathArr[i]] = {}
      } else {
        tmp = tmp[pathArr[i]]
      }
    }
    tmp[pathArr[i]] = value
  }

  const validateForm = () => {
    const result = {
      valid: true
    } as SubmitResult
    modelValueResult = {}
    for (const component of formState.components) {
      const resultComponent = component.validate()
      if (!resultComponent.valid) {
        result.valid = false
      } else {
        createObject(result, component.name, {
          value: resultComponent.value,
          updated: resultComponent.updated
        })
        if (isFormModelValue) {
          createObject(modelValueResult, component.name, resultComponent.value)
        }
      }
    }
    return result
  }

  const setPassThroughData = (data) => {
    dataPassThrough = data
  }

  const reInitializeData = (data) => {
    const modelValue = data ? Object.assign({}, data) : null
    for (const component of formState.components) {
      component.initData(modelValue)
    }
  }

  const onSubmit = () => {
    const result = validateForm()
    if (result.valid) {
      if (isFormModelValue) {
        emits('update:modelValue', modelValueResult)
      }
      emits('submit', result, dataPassThrough)
    }
  }

  return {
    setPassThroughData,
    reInitializeData,
    onSubmit
  }
}

export function useFormChild (props: FormChildProps) {
  const form = inject('form', null)
  const uid = getCurrentInstance().uid

  let { name } = props
  if (!name) {
    name = `input${uid}`
  }

  const data = reactive({
    valid: false,
    updated: false,
    error: null,
    value: null
  }) as Data

  /**
     * Rules
     */
  const { addRules, validate } = useRules(form.locales, data)

  if (props.rules) {
    addRules(props.rules)
  }

  const initData = (formModelValue: any) => {
    if (props.modelValue !== null) {
      data.value = props.modelValue
    } else if (formModelValue !== null) {
      data.value = getModelValueByProperty(formModelValue, name, null)
    }
  }

  const update = (value: any) => {
    data.value = value
  }

  onMounted(() => {
    if (form) {
      form.bind({
        uid,
        name,
        validate,
        initData
      })
    }
  })
  onBeforeUnmount(() => {
    if (form) {
      form.unbind(uid)
    }
  })

  return {
    data,
    update
  }
}
