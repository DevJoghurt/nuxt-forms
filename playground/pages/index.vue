<template>
  <section class="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
    <div class="bg-gray-50 border-1 rounded min-h-screen">
      <h1 class="text-red-600">
        Test
      </h1>
      <div>
        <SimpleForm
          v-model="formdata"
          lang="en"
          :locales="{
            test: 'Email must be test@test.de'
          }"
          @submit="submit"
        >
          <FormChild
            v-slot="{error,value, update}"
            v-model="email"
            name="email"
            :rules="['required','email',{
              validator: (value) => {
                return value === 'test@test.de'
              },
              error: 'test'
            }
            ]"
          >
            <div v-if="error" class="text-red-500">
              {{ error }}
            </div>
            <input class="w-60 h-8 border" :value="value" @input="event => update((event.target as HTMLInputElement).value)">
          </FormChild>
          <FormChild v-slot="{error,value, update}" name="password" :rules="['required','password']">
            <div v-if="error" class="text-red-500">
              {{ error }}
            </div>
            <input type="password" class="w-60 h-8 border" :value="value" @input="event => update((event.target as HTMLInputElement).value)">
          </FormChild>
          <FormChild v-slot="{error,value, update}" name="privacy" :rules="['approval']">
            <div class="relative flex items-start mt-2">
              <div v-if="error" class="text-red-500">
                {{ error }}
              </div>
              <div class="flex h-5 items-center">
                <input aria-describedby="comments-description" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" :value="value" @input="event => update((event.target as HTMLInputElement).checked)">
              </div>
              <div class="ml-3 text-sm">
                <span class="text-gray-500">Test</span>
              </div>
            </div>
          </FormChild>
          <div>
            <button type="submit" class="w-60 h-8 border">
              Submit
            </button>
          </div>
        </SimpleForm>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const formdata = ref({
  email: 'max@mustermann.de'
})

const email = ref('test1@test.de')

const submit = (data) => {
  // eslint-disable-next-line no-console
  console.log(data, formdata)
}
</script>
