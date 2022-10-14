<template>
  <div>
    <slot :error="data.error" :valid="data.valid" :value="data.value" :update="update" />
  </div>
</template>
<script setup lang="ts">
import { useFormChild } from '../composables/form'
import type { RulesetTypes, Rule } from '../utils/rules'

export type FormChildProps = {
        name?: string | null,
        rules?: RulesetTypes | (RulesetTypes|Rule)[],
        modelValue?: any
    }

const props = withDefaults(defineProps<FormChildProps>(), {
  name: null,
  rules: null,
  modelValue: null
})

const { data, update } = useFormChild(props)

</script>
