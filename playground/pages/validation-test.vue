<template>
  <div class="container">
    <article>
      <h1>Validation Test Example</h1>
      <div class="grid">
        <NuxtForm
          v-slot="{ reset }"
          @submit="submit"
        >
          <div>
            <Field
              v-slot="{ valid, errors, updateValue, value}"
              name="test.[]"
              :rules="[]"
              :validate-on-change="true"
            >
              <label>
                Test
                <input type="text" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
            <button @click="reset">
              Reset
            </button>
          </div>
        </NuxtForm>
      </div>
    </article>
  </div>
</template>
<script setup lang="ts">

const { submit } = useFormSubmit<FormData>((data) => {
  console.log(data)
}, {
  onSuccess (data) {
    console.log('onSuccess', data)
  }
})
</script>
