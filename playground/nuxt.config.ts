// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    'nuxt-forms'
  ],
  css: ['@picocss/pico/css/pico.css'],
  forms: {
    locales: ['en', 'de'],
    security: {
      csrf: {
        cookieName: 'csrf',
        paramName: 'csrf',
      }
    }
  }
})
