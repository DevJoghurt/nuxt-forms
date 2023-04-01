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

type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: any): void
}

type FormProps = {
  csrf?: boolean
  modelValue?: any
  clearOnSubmit?: boolean
  schema?: ZodTypeAny
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
  }
  emits('submit', result)
}
</script>
