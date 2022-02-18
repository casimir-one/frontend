module.exports = {
  root: true,
  extends: [
    './packages/common/eslint-config',
    './packages/common/eslint-config/vue'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },
      plugins: ['@typescript-eslint'],
      extends: [
        './packages/common/eslint-config',
        './packages/common/eslint-config/vue',
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base'
      ],
      rules: {
        '@typescript-eslint/comma-dangle': [
          'error',
          'never'
        ]
      }
    }
  ]
};
