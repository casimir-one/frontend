module.exports = {
  presets: [
    '@babel/preset-env'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-private-methods', { loose: true }]
  ]
};
