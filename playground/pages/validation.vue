<template>
  <div class="container">
    <article>
      <h1>Validation Example</h1>
      <div class="grid">
        <div>
          <NuxtForm
            v-model="formData"
            :lang="lang"
            @submit="submit"
          >
            <div>
              <Field
                v-slot="{ valid, errors, updateValue, value}"
                name="email"
                :rules="[emailVal,custom]"
                :validate-on-change="true"
              >
                <label>
                  Email
                  <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                  <small v-if="!valid">{{ errors[0] }}</small>
                </label>
              </Field>
            </div>
          </NuxtForm>
        </div>
        <div>
          <Field
            v-slot="{ valid, errors, updateValue, value}"
            name="password"
            :rules="[passwordLength({ length: 8 })]"
            :validate-on-change="true"
          >
            <label>
              Password
              <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
              <small v-if="!valid">{{ errors[0] }}</small>
            </label>
          </Field>
        </div>
      </div>
    </article>
  </div>
</template>
<script setup lang="ts">
  import { email, length } from '@vee-validate/rules'

  const lang = ref('de')

  const formData = ref({
    email: ''
  })
  const emailVal = useValidation(email, 'Email is not valid')
  const passwordLength = useValidation(length, 'Password must be {length} characters long')
  const custom = useValidation(value => value === 'test@test.de', 'Email must be test@test.de')

  type FormData = typeof formData.value

  const { submit } = useFormSubmit<FormData>((data) => {
    console.log(data)
  }, {
    onSuccess (data) {

    }
  })

</script>
