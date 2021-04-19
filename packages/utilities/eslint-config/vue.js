module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "extends": [
    "plugin:vue/recommended",
    "@vue/airbnb"
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "plugins": [
    "vuetify"
  ],
  "rules": {
    "import/prefer-default-export": "off",
    "vuetify/no-deprecated-classes": "error",
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-legacy-grid": "error",
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "state",
          "Vue",
          "_Vue"
        ]
      }
    ],
    "import/extensions": [
      "error",
      "always",
      {
        "js": "never",
        "vue": "never"
      }
    ],
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
    "vue/script-indent": [
      "error",
      2,
      {
        "baseIndent": 1
      }
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        "singleline": 3
      }
    ],
    "comma-dangle": [
      "error",
      "never"
    ]
  },
  "overrides": [
    {
      "files": [
        "*.vue"
      ],
      "rules": {
        "indent": "off"
      }
    }
  ]
}