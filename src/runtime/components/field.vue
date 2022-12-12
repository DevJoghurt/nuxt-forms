<template>
    <slot :errors="errors" :valid="valid" :value="value" :updateValue="updateValue" />
</template>
<script setup lang="ts">
import { useField } from '../composables/useField'
import type { ValidationRule } from '../../types'
import type { ZodTypeAny } from 'zod'


type FieldProps = {
  name: string
  label?: string | null
  modelValue?: any
  schema?: ZodTypeAny
  validateOnChange?: boolean
  rules?: (ValidationRule | (() => ValidationRule))[]
}

type FieldEmits = {
    (eventName: 'update:modelValue', value: object): void
}

const emits = defineEmits<FieldEmits>()

const props = withDefaults(defineProps<FieldProps>(), {
  name: '',
  validateOnChange: false,
  modelValue: null
})

const { valid, errors, value, updateValue } = useField(props.name, {
  initialData: props.modelValue,
  schema: props.schema,
  rules: props.rules,
  validateOnChange: props.validateOnChange,
  label: props.label,
  onValidate: (value) => {
    emits('update:modelValue', value)
  }
})

</script>
