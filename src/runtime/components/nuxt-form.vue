
<template>
  <form @submit.prevent="onSubmit">
    <input v-if="csrf && config.forms.csrf" v-model="csrfToken" :name="config.forms.csrf.paramName" type="hidden">
    <slot />
  </form>
</template>
<script setup lang="ts">
import { useRuntimeConfig } from '#app'
import { useForm } from '../composables/form'
import type { LocaleTypes } from '../utils/locales'
import { ref, onBeforeMount } from '#imports'

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
        modelValue?: object | null,
        csrf?: boolean,
    }
export type FormEmits = {
        (eventName: 'update:modelValue', value: object): void
        (eventName: 'submit', result: SubmitResult, dataPassThrough: any): void
    }

const { public: config } = useRuntimeConfig()

const csrfToken = ref(null)

const props = withDefaults(defineProps<FormProps>(), {
  lang: 'en',
  locales: null,
  modelValue: null,
  csrf: false
})

const emits = defineEmits<FormEmits>()

const { onSubmit } = useForm(props, emits)

onBeforeMount(() => {
  if (props.csrf && config.forms.csrf && config.forms.csrf.cookieName) {
    csrfToken.value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${config.forms.csrf.cookieName}=`))
      ?.split('=')[1]
  }
})
</script>
