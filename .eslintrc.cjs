module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  rules: {
    'vue/multi-word-component-names': ['error', {
      ignores: ['Logo','index', 'field']
    }],
    'vue/no-setup-props-destructure': 'off'
  }
}
