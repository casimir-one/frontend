module.exports = {
  root: true,
  extends: [
    './packages/common/eslint-config'
  ],
  overrides: [
    // for files with vue extensions
    {
      files: ['**/*.vue'],
      extends: [
        './packages/common/eslint-config/vue-typescript'
      ]
    },
    // for files with ts extensions
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['./packages/common/eslint-config/typescript']
    }
  ]
};
