<template>
    <div class="container">
      <article>
        <h1>Vue 3 Form</h1>
        <div class="grid">
          <NuxtForm
            v-model="formData"
            :csrf="true"
            @submit="submit"
          >
            <Field
              v-slot="{errors,valid, value, updateValue}"
              label="Email"
              name="email"
              :validate-on-change="true"
              :rules="[required, email]"
            >
            <label>
              Email
              <input :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)">
              <small v-if="!valid">
                {{ errors[0] }}
              </small>
            </label>
            </Field>
            <Field 
              v-slot="{valid, errors,value, updateValue}" 
              :rules="[required, min(4)]"
              :validate-on-change="true"
              label="Password"
              name="password">
              <label>
                Password
                <input type="password" :aria-invalid="!valid ? true : undefined" :value="value" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid">
                  {{ errors[0] }}
                </small>         
              </label> 
            </Field>
            <Field 
              v-slot="{valid,errors,value, updateValue}" 
              name="tel" 
              v-model="tel"
              :validate-on-change="true"
              :rules="[regex('/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g')]">
              <label>
                Tel
                <input type="tel" :aria-invalid="!valid ? true : undefined" name="tel" :value="value" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid" class="text-red-500">
                  {{ errors[0] }}
                </small>
              </label>
            </Field>
            <Field 
              v-slot="{valid,errors,value, updateValue}"
              label="Test"
              name="test" 
              v-model="tel"
              :validate-on-change="true"
              :rules="[test]">
              <label>
                Test
                <input type="text" :aria-invalid="!valid ? true : undefined" name="tel" :value="value" @input="event => updateValue((event.target as HTMLInputElement).value)">
                <small v-if="!valid" class="text-red-500">
                  {{ errors[0] }}
                </small>
              </label>
            </Field>
            <Field v-slot="{valid,errors,value, updateValue}" name="privacy" :rules="[]">
              <label>
                Checkbox
                <input type="checkbox" :aria-invalid="!valid ? true : undefined" name="privacy" :value="value" @input="event => updateValue((event.target as HTMLInputElement).checked)">
                <small v-if="!valid" class="text-red-500">
                  {{ errors[0] }}
                </small>
              </label>
            </Field>
            <div>
              <button type="submit">
                Submit
              </button>
            </div>
          </NuxtForm>
          <div></div>
        </div>
      </article>
    </div>
</template>
<script setup lang="ts">

const formData = ref(null)
const tel = ref('+49 123 456789')

const { customRule, required, email, min, regex } = useValidation({
  customMessages:{
    required: 'This field is required!!!',
    email: 'This field must be a valid email!!',
    min: 'This field must be at least {length} characters!!!'
  }
})

const testVal = ref('test')

const test = customRule((value: any) => {
  if (value === testVal.value) {
    return true
  }
  return `Value must be ${testVal.value}`
})


const submit = (data: any) => {
  // eslint-disable-next-line no-console
  console.log(data, formData)
}
</script>
