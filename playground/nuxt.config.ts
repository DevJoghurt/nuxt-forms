// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  modules: [
    'nuxt-forms'
  ],
  css: ['@picocss/pico/css/pico.css'],
  forms: {}
})