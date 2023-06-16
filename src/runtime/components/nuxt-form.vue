<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
<script setup lang="ts">
import type { ZodTypeAny } from 'zod'
import type { InjectionKey } from 'vue'
import { useForm } from '../composables/useForm'
import type { FormContext } from '../types'

type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: any): void
}

type FormProps = {
  contextKey?: InjectionKey<FormContext>
  modelValue?: any
  clearOnSubmit?: boolean
  schema?: ZodTypeAny
}

const props = withDefaults(defineProps<FormProps>(), {
  clearOnSubmit: false
})

const emits = defineEmits<FormEmits>()

const { handleSubmit } = useForm({
  key: props.contextKey,
  initialData: props.modelValue,
  clearOnSubmit: props.clearOnSubmit,
  schema: props.schema
})

const onSubmit = async () => {
  const result = await handleSubmit()
  if (props.modelValue) {
    emits('update:modelValue', result.value)
  }
  emits('submit', result)
}
</script>
