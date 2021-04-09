module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "plugins": [
    "import"
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "rules": {
    "semi": ["error", "always"],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "always",
      {
        "js": "never"
      }
    ],
    "no-restricted-syntax": "off",
    "no-underscore-dangle": [
      "error",
      {
        "allow": [
          "_id"
        ],
        "allowAfterThis": true,
        "enforceInMethodNames": false
      }
    ],
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error",
          "info"
        ]
      }
    ],
    "comma-dangle": [
      "error",
      "never"
    ]
  }
}