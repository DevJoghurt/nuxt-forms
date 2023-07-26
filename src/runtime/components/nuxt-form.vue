<template>
  <form @submit.prevent="onSubmit">
    <slot
      :reset="reset"
      :valid="valid"
      :errors="errors"
    />
  </form>
</template>
<script setup lang="ts">
import type { AnyZodObject } from 'zod'
import { useForm } from '../composables/useForm'

type FormEmits = {
    (eventName: 'update:modelValue', value: object): void
    (eventName: 'submit', result: any): void
}

type FormProps = {
  modelValue?: any
  clearOnSubmit?: boolean
  schema?: AnyZodObject | undefined
}

const props = withDefaults(defineProps<FormProps>(), {
  modelValue: null,
  schema: undefined,
  clearOnSubmit: false
})

const emits = defineEmits<FormEmits>()

const { handleSubmit, reset, valid, errors } = useForm({
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
