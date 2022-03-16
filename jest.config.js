module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'vue'
  ],
  moduleNameMapper: {
    '\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!crc)/',
    '/node_modules/(?!vuetify)/'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.*\\.(vue)$': 'vue-jest'
  },
  testPathIgnorePatterns: [
    'packages/common/lib-crypto',
    'packages/casimir/services/RpcClient',
    'packages/casimir/models',
    'packages/generators',
    '__tests__/helpers'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom'
};
