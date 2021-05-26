module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '\\.(css|sass)$': '<rootDir>/__mocks__/styleMock.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!crc)/',
    '/node_modules/(?!vuetify)/'
  ],
  transform: {
    '^.+\\.(js)?$': 'babel-jest',
    '^.*\\.(vue)$': 'vue-jest'
  },
  testPathIgnorePatterns: [
    'packages/utilities/lib-crypto',
    'packages/services/RpcClient'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
