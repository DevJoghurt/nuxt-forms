
<template>
  <form @submit.prevent="onSubmit">
    <Csrf v-if="csrf" />
    <slot />
  </form>
</template>
<script setup lang="ts">
import Csrf from './csrf.vue'
import { useForm } from '../composables/useForm'
import type { ZodTypeAny } from 'zod'


export type SubmitResult = {
  valid: boolean
  value: any
  errors: string[]
  fields: Record<string, any>
}

export type FormProps = {
  csrf?: boolean
  modelValue?: any
  clearOnSubmit?: boolean
  schema?: ZodTypeAny
}
export type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: SubmitResult): void
}

const props = withDefaults(defineProps<FormProps>(), {
  csrf: false,
  clearOnSubmit: false
})

const emits = defineEmits<FormEmits>()

const { handleSubmit } = useForm({
  initialData: props.modelValue,
  clearOnSubmit: props.clearOnSubmit,
  schema: props.schema
})

const onSubmit = async () => {
  const result = await handleSubmit()
  if (props.modelValue) {
    emits('update:modelValue', result.value)
  }else{
    emits('submit', result)
  }
}
</script>
