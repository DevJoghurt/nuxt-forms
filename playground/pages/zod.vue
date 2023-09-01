<template>
  <div class="container">
    <article>
      <h1>Zod Example</h1>
      <div class="grid">
        <div>
          <NuxtForm
            v-model="modelData"
            :validate="formValidator"
            @submit="submit"
          >
            <Field v-slot="{ valid, errors, updateValue, value}" name="email" :validate-on-change="true">
              <label>
                Email
                <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field v-slot="{ valid, errors, updateValue, value}" name="password">
              <label>
                Password
                <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field
              v-slot="{ valid, errors, updateValue, value}"
              name="others.tel"
              :validate-on-change="true"
            >
              <label>
                Tel
                <input type="tel" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field
              v-slot="{ valid, errors, updateValue, value}"
              name="url"
              :validate="urlValidator"
              :validate-on-change="true"
            >
              <label>
                Url
                <input type="text" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field
              v-slot="{ valid, errors, updateValue, value}"
              :rules="[equalToField]"
              name="others.test"
              :bind-form-data="true"
              :validate-on-change="true"
            >
              <label>
                Test
                <input type="text" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field v-slot="{ valid, errors, updateValue, value}" name="others.privacy">
              <fieldset>
                <label>
                  <input type="checkbox" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).checked)">
                  Privacy
                </label>
                <small v-if="!valid">{{ errors[0] }}</small>
              </fieldset>
            </Field>
            <button type="submit">
              Submit
            </button>
          </NuxtForm>
        </div>
        <div />
      </div>
    </article>
  </div>
</template>
<script setup lang="ts">
import { z } from 'zod'

const formSchema = z.object({
  email: z.string({ invalid_type_error: 'You have ' }).email({ message: 'Dies ist keine gültige E-Mail' }).default('test@test.de'),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(10).default('12345678'),
  others: z.object({
    tel: z.string({ invalid_type_error: 'Please enter a phone number' }).regex(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g, {
      message: 'Please enter a valid phone number'
    }).default('01234567'),
    privacy: z.boolean({ invalid_type_error: 'Privacy nicht gewählt' }).refine(value => value === true, {
      message: 'You must agree to the privacy policy'
    }).default(false),
    test: z.string().min(8).optional().or(z.null()).or(z.literal(''))
  }).optional()
})

const urlSchema = z.string().url({ message: 'This is not a valid URL' }).default('https://google.com')

const urlValidator = useZodValidator(urlSchema)


const equalToField = useRuleValidator('equalToField', {
  errorMessage: 'This field must be equal to name',
  params: {
    field: 'others.tel'
  }
})

const formValidator = useZodValidator(formSchema)

const modelData = ref({
  email: 'jo@test.de'
})


type Register = z.infer<typeof formSchema>;

interface ErrorType {
  code: string
  message: string
}

interface DataReturnType {
  success: boolean
}

const { submit, loading, error, data } = useFormSubmit<Register, DataReturnType, ErrorType>((formData) => {
  console.log(formData)
  return {
    success: true
  }
}, {
  onFormError: (formData) => {
    console.log(formData.errors)
  },
  onSuccess: (data) => {
    console.log(data)
  },
  onError: (error) => {
    console.log(error?.code)
  }
})

console.log(data.value?.success)
console.log(error.value?.code)

</script>
