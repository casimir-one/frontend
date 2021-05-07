module.exports = {
  transformIgnorePatterns: [
    '/node_modules/(?!crc)/',
    '/node_modules/(?!vuetify)/'
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    'packages/utilities/lib-crypto',
    'packages/services/RpcClient'
  ]
};
