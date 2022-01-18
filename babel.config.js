module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: 'last 1 chrome version'
    }],
    '@babel/preset-typescript',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-private-methods', { loose: true }]
  ],
  env: { test: { presets: ['@babel/preset-env'] } }
};
