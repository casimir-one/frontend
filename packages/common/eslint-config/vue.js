module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'plugin:vue/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: [
    'vue',
    'jsx'
  ],
  rules: {
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'Vue',
          '_Vue'
        ]
      }
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        vue: 'never'
      }
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3
      }
    ],
    'vue/valid-v-slot': ['error', {
      allowModifiers: true
    }],
    'no-plusplus': 'off',
    'class-methods-use-this': 'off'
  },
  overrides: [
    {
      files: [
        '*.vue'
      ],
      rules: {
        indent: 'off'
      }
    }
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.vue'
        ]
      }
    }
  }
};
