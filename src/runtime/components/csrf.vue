<template>
    <input v-model="csrfToken" :name="csrfParamName" type="hidden" />
</template>
<script setup lang="ts">
import { useRuntimeConfig } from '#app'
import { ref, onBeforeMount } from '#imports'

const { public: config } = useRuntimeConfig()

const csrfToken = ref<string|null|undefined>(null)
const csrfParamName = ref<string|undefined>(undefined)

onBeforeMount(() => {
  if(config?.forms?.csrf?.paramName) {
    csrfParamName.value = config.forms.csrf.paramName
  }
  if (config.forms.csrf && config.forms.csrf.cookieName) {
    csrfToken.value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${config.forms.csrf.cookieName}=`))
      ?.split('=')[1]
  }
})
</script>