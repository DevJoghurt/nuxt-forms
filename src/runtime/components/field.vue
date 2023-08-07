<template>
  <div>
    <slot :errors="errors" :valid="valid" :value="value" :update-value="updateValue" />
  </div>
</template>
<script setup lang="ts">
  import { onBeforeUnmount } from '#imports'
  import { useField } from '../composables/useField'
  import { useFormContext } from '../composables/useFormContext'
  import type { ValidatorAdapter } from '../types'

  export type FieldProps = {
    name: string
    label?: string | null
    modelValue?: any
    validate?: ValidatorAdapter<'field'> | ValidatorAdapter<'field'>[] | undefined
    validateOnChange?: boolean | 'form' | 'field'
    bindFormData?: boolean
  }

  export type FieldEmits = {
      (eventName: 'update:modelValue', value: object): void
  }

  const emits = defineEmits<FieldEmits>()

  const props = withDefaults(defineProps<FieldProps>(), {
    name: '',
    label: null,
    validate: undefined,
    validateOnChange: false,
    modelValue: null
  })

  const { valid, errors, value, updateValue, bindForm, unbindForm } = useField(props.name, {
    initialData: props.modelValue,
    validate: props.validate,
    validateOnChange: props.validateOnChange,
    bindFormData: props.bindFormData,
    label: props.label,
    onValidate: (value) => {
      emits('update:modelValue', value)
    }
  })

  const form = useFormContext()

  bindForm(form)

  onBeforeUnmount(() => {
    unbindForm()
  })

</script>
