export default defineAppConfig({
  docus: {
    title: 'Nuxt Forms',
    description: 'Easy and minimal client-side form handling for Nuxt 3.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
    socials: {
      twitter: 'DerJoghurt',
      github: 'disedia/nuxt-forms'
    },
    github: {
      dir: '.starters/default/content',
      branch: 'main',
      repo: 'docus',
      owner: 'nuxt-themes',
      edit: true
    },
    header: {
      logo: true
    },
    footer: {
      iconLinks: [
        {
          href: 'https://nuxt.com',
          icon: 'simple-icons:nuxtdotjs'
        }
      ]
    }
  }
})
