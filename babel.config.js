module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
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
      ]
    }
  }
};
