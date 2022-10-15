
<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
<script setup lang="ts">
import { useForm } from '../composables/form'
import type { LocaleTypes } from '../utils/locales'
// import type { FormEmits, FormProps } from '../composables/form'

/**
     * must be added manually until vue 3.3
     * see: https://github.com/vuejs/core/issues/4294
     */
export type SubmitResult = {
        valid: boolean
    }
export type FormProps = {
        lang?: 'en' | 'de' | 'es' | 'fr' | 'it',
        locales?: LocaleTypes | null,
        modelValue?: object | null
    }
export type FormEmits = {
        (eventName: 'update:modelValue', value: object): void
        (eventName: 'submit', result: SubmitResult, dataPassThrough: any): void
    }

const props = withDefaults(defineProps<FormProps>(), {
  lang: 'en',
  locales: null,
  modelValue: null
})

const emits = defineEmits<FormEmits>()

const { onSubmit } = useForm(props, emits)
</script>
