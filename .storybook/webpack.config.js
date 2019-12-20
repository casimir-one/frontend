const path = require('path');
const loaderUtils = require("loader-utils");

const isDev = process.env.NODE_ENV === 'development';

const moduleCssLoader = [
  'vue-style-loader',
  {
    loader: 'css-loader',
    options: {
      url: false,
      modules: {
        getLocalIdent: (loaderContext, localIdentName, localName, options) => {
          const moduleName = path.parse(loaderContext.resourcePath).name;
          const moduleNameHash = loaderUtils.getHashDigest('DEIP' + moduleName, null, null, 6);

          const className = localName.includes('host') ? localName.replace('host', moduleNameHash) : [moduleNameHash, localName].join('__');
          const classNameHash = loaderUtils.getHashDigest(className, null, null, 6);

          return isDev ? className : classNameHash;
        },
      },
      sourceMap: isDev
    }
  }
];

const cssLoader = [
  'vue-style-loader',
  {
    loader: 'css-loader',
    options: {
      url: false
    }
  }
];

const sassLoader = [
  {
    loader: "sass-loader",
    options: {
      implementation: require("sass")
    },
  }
];

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            loaders: [
              ...moduleCssLoader
            ]
          },
          {
            loaders: [
              ...cssLoader
            ]
          }
        ],
      },
      {
        test: /\.(sass|scss)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            loaders: [
              ...moduleCssLoader,
              ...sassLoader
            ]
          },
          {
            loaders: [
              ...cssLoader,
              ...sassLoader
            ]
          }
        ],
        include: path.resolve(__dirname, '../'),
      },
    ],
  },
};
