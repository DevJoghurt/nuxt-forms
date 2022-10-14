// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'simple-forms'
  ],
  tailwindcss: {
    configPath: '~/playground/tailwind.config.js'
  }
})
