<template>
  <div class="container">
    <article>
      <h1>Validation Example</h1>
      <div class="grid">
        <div>
          <NuxtForm
            v-slot="{ reset }"
            v-model="formData"
            @submit="submit"
          >
            <Wrapper>
              <div>
                <Field
                  v-slot="{ valid, errors, updateValue, value}"
                  name="email"
                  :rules="[required, emailVal,custom]"
                  :validate-on-change="true"
                >
                  <label>
                    Email
                    <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                    <small v-if="!valid">{{ errors[0] }}</small>
                  </label>
                </Field>
              </div>
            </Wrapper>
            <div>
              <Field
                v-slot="{ valid, errors, updateValue, value}"
                name="number"
                :rules="[between([1, 10])]"
                :validate-on-change="true"
              >
                <label>
                  Number
                  <input type="number" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                  <small v-if="!valid">{{ errors[0] }}</small>
                </label>
              </Field>
            </div>
            <div>
              <Field
                v-slot="{ valid, errors, updateValue, value}"
                name="password"
                :rules="[passwordLength]"
                :validate-on-change="'form'"
              >
                <label>
                  Password
                  <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                  <small v-if="!valid">{{ errors[0] }}</small>
                </label>
              </Field>
            </div>
            <div>
              <Field
                v-slot="{ valid, errors, updateValue, value}"
                name="passwordConfirm"
                :validate-on-change="true"
                :bind-form-data="true"
                :rules="[passwordLength, equalToField('password')]"
              >
                <label>
                  Password Confirm
                  <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                  <small v-if="!valid">{{ errors[0] }}</small>
                </label>
              </Field>
            </div>
            <div>
              <button type="submit">
                Submit
              </button>
              <button type="button" @click="reset">
                Reset
              </button>
            </div>
          </NuxtForm>
        </div>
      </div>
      <h1>Second Form with context</h1>
      <div class="grid">
        <NuxtForm
          @submit="secondSubmit"
        >
          <div>
            <Field
              v-slot="{ valid, errors, updateValue, value}"
              name="email2"
              context="secondFormContext"
              :rules="[required, emailVal,custom]"
              :validate-on-change="true"
            >
              <label>
                Email
                <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </NuxtForm>
      </div>
    </article>
  </div>
</template>
<script setup lang="ts">
const formData = ref({
  email: 'test@test.de'
})

const emailVal = useValidation((value: string) => {
  if (!value) { return false }
  return value.includes('@')
}, 'Email must be valid')
const passwordLength = useValidation((value: string) => {
  if (!value) { return false }
  return value.length >= 8
}, 'Password must be {length} characters long')
const custom = useValidation(value => value === 'test@test.de', 'Email must be test@test.de')

const required = useValidation('required', 'Field is required')
const between = useValidation('between', 'Field must be between 1 and 10')

const equalToField = useValidation('equalToField', 'Field must be equal to {field}')

  type FormData = typeof formData.value

const { submit } = useFormSubmit<FormData>((data) => {
  console.log(data)
}, {
  onSuccess (data) {

  }
})

const { submit: secondSubmit } = useFormSubmit<FormData>((data) => {
  console.log('secondSubmit', data)
}, {
  onSuccess (data) {

  }
})

</script>
