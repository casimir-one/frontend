module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      targets: {
        node: 'current'
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
  ]
};
