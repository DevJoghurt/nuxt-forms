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
                  :validate="[required, emailVal,custom]"
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
                :validate="[between]"
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
                :validate="[passwordLength]"
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
                :validate-on-change="'form'"
                :bind-form-data="true"
                :validate="[passwordLength, equalToField]"
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
              :validate="[required, emailVal,custom]"
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

const emailVal = useCustomValidator((value: string) => {
  if (!value) { return false }
  return value.includes('@')
}, {
  errorMessage: 'Email must include @'
})
const passwordLength = useCustomValidator((value: string, params) => {
  if (!value) { return false }
  return value.length >= params.length
}, {
  errorMessage: 'Password must be at least {length} characters long',
  params: {
    length: 6
  }
})

const custom = useCustomValidator(value => value === 'test@test.com', {
  errorMessage: 'Email must "test@test.com"'
})

const required = useRuleValidator('required', {
  errorMessage: 'Field is required'
})
const between = useRuleValidator('between', {
  errorMessage: 'Field must be between {min} and {max}',
  params: {
    max: 10,
    min: 5
  }
})

const equalToField = useRuleValidator('equalToField', {
  errorMessage: 'Field must be equal to {fieldLabel}',
  params: {
    field: 'password'
  }
})

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
