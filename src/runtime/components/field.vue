<template>
  <div>
    <slot :errors="errors" :valid="valid" :value="value" :update-value="updateValue" />
  </div>
</template>
<script setup lang="ts">
import type { AnyZodObject } from 'zod'
import { useField } from '../composables/useField'
import type { ValidationRule } from '../types'

type FieldProps = {
  name: string
  label?: string | null
  modelValue?: any
  schema?: AnyZodObject | undefined
  validateOnChange?: boolean | 'form' | 'field'
  bindFormData?: boolean
  rules?: (ValidationRule | (() => ValidationRule))[] | undefined
}

type FieldEmits = {
    (eventName: 'update:modelValue', value: object): void
}

const emits = defineEmits<FieldEmits>()

const props = withDefaults(defineProps<FieldProps>(), {
  name: '',
  label: null,
  schema: undefined,
  rules: undefined,
  validateOnChange: false,
  modelValue: null
})

const { valid, errors, value, updateValue } = useField(props.name, {
  initialData: props.modelValue,
  schema: props.schema,
  rules: props.rules,
  validateOnChange: props.validateOnChange,
  bindFormData: props.bindFormData,
  label: props.label,
  onValidate: (value) => {
    emits('update:modelValue', value)
  }
})

</script>
