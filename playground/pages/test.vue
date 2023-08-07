<template>
    <div class="container">
        <article>
            <h1>Zod Example</h1>
            <div class="grid">
            <div>
                <NuxtForm
                v-model="modelData"
                :validate="[validator, secondValidator]"
                @submit="submit"
                >
                <Field v-slot="{ valid, errors, updateValue, value}" name="email" :validate-on-change="true">
              <label>
                Email
                <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field 
              v-slot="{ valid, errors, updateValue, value}" 
              name="password">
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
              :validate="urlFieldValidator"
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
              name="others.test"
              label="Test"
              :validate="[ruleVal]"
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
            </div>
        </article>
    </div>
</template>
<script setup lang="ts">
import { z } from 'zod'

const formSchema = z.object({
  email: z.string({ required_error: 'E-Mail is required' ,invalid_type_error: 'Eine E-Mail ist erforderlich' }).email({ message: 'Dies ist keine gültige E-Mail' }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password is required'
  }).min(8, { message: 'Password must be at least 8 characters long' }).max(10).default('12345678'),
  others: z.object({
    tel: z.string({ invalid_type_error: 'Please enter a phone number' }).regex(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g, {
      message: 'Please enter a valid phone number'
    }).default('12345678'),
    privacy: z.boolean({ invalid_type_error: 'Privacy nicht gewählt' }).refine(value => value === true, {
      message: 'You must agree to the privacy policy'
    }).default(false),
    test: z.string().min(8,{
      message: 'Your text "{fieldLabel}" must be at least 8 characters long'
    }).optional().transform(val => val + 'test').or(z.null()).or(z.literal(''))
  })
})

const testSchema = z.string().url({ message: 'This is not a valid URL' }).default('https://google.de')

const urlFieldValidator = useZodValidator(testSchema, {
  parseDefaults: true,
})

const ruleVal = useRuleValidator('required',{
  errorMessage: 'This field is required TEST'
})

const modelData = ref({
  email: 'jo@test.de'
})

const validator = useZodValidator(formSchema, {
  parseDefaults: true,
})

const urlValidator = z.object({ 
  url: z.string().url({ message: '{url} is not a valid URL' }).default('https://google.com')
})

const secondValidator = useZodValidator(urlValidator, {
  parseDefaults: true,
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

</script>