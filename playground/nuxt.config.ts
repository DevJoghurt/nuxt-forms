// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    'nuxt-forms'
  ],
  css: ['@picocss/pico/css/pico.css'],
  forms: {
    locales: false,
    security: {
      csrf: {
        cookieName: 'csrf',
        paramName: 'csrf',
      }
    }
  }
})
