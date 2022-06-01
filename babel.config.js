module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['./plugins/babelJsdocFix.js']
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: true },
          modules: 'commonjs'
        }],
        '@babel/preset-typescript'
      ]
    },
    lib: {
      presets: [
        ['@babel/preset-env', {
          modules: false,
          targets: 'last 1 chrome version'
        }],
        '@babel/preset-typescript',
        '@vue/babel-preset-jsx'
      ],
      ignore: [
        '**/__snapshots__',
        '**/__tests__',
        '**/__stories__'
      ]
    }
  }
};
