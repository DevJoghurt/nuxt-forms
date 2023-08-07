<template>
  <div class="container">
    <article>
      <h1>Zod Example</h1>
      <div class="grid">
        <div>
          <NuxtForm
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
            <Field 
              v-slot="{ valid, errors, updateValue, value}" 
              name="password"
              validate-on-change="form">
              <label>
                Password
                <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
            </Field>
            <Field v-slot="{ valid, errors, updateValue, value}" 
              name="passwordConfirm" 
              validate-on-change="form">
              <label>
                Password Confirm
                <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">{{ errors[0] }}</small>
              </label>
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
  email: z.string({ invalid_type_error: 'Eine E-Mail ist erforderlich' }).email({ message: 'Dies ist keine gültige E-Mail' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(10),
  passwordConfirm: z.string()
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm']
})

const formValidator = useZodValidator(formSchema)

  type Register = z.infer<typeof formSchema>;

const { submit } = useFormSubmit<Register>((formResult) => {
  console.log(formResult.value)
})
</script>
