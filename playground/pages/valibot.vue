<template>
    <div class="container">
      <article>
        <h1>Valibot Example</h1>
        <div class="grid">
          <div>
            <NuxtForm
              :validate="formValidator"
              @submit="submit"
            >
              <Field 
                v-slot="{ valid, errors, updateValue, value}" 
                name="email" 
                :validate-on-change="true">
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
                :validate="confirmPassword"
                :bind-form-data="true" 
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
  import { type Input, object, string, email, endsWith, minLength } from 'valibot'
  
  const formSchema = object({
        email: string('Your email must be a string.',[
            email('The email address is badly formatted.'), 
            endsWith('@example.com', 'The email address must end with @example.com')]),
        password: string('Your password must be a string.',
        [
            minLength(8, 'Your password must be at least 8 characters long.'),
            endsWith('123', 'Your password must end with 123')])
    })
  
    const formValidator = useValibotValidator(formSchema)

    const confirmPassword = useRuleValidator('equalToField', {
        errorMessage: 'Your password and password confirmation must match.',
        params: {
          field: 'password'
        }
    })
  
    type Register = Input<typeof formSchema>;
  
    const { submit } = useFormSubmit<Register>((formResult) => {
        console.log(formResult.value)
    })
  </script>
  