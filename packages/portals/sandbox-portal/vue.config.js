// eslint-disable-next-line import/no-unresolved
const path = require('path');

module.exports = {
  productionSourceMap: false,
  lintOnSave: false,

  chainWebpack: (config) => {
    for (const module of ['vue', 'vuex', 'vue-router', 'vuetify']) {
      config.resolve.alias.set(module, path.join(__dirname, 'node_modules', module));
    }
    config.module
      .rule('import-meta')
      .test(/\.js$/)
      .use('@open-wc/webpack-import-meta-loader')
      .loader('@open-wc/webpack-import-meta-loader');
  },

  devServer: {
    setup(app) {
      app.get('/env', (req, res) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        res.json(require(path.join(__dirname, 'config', 'env.js')));
      });
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  transpileDependencies: [
    '@deip/*',
    'vuetify',
    '@polkadot/*'
  ],

  runtimeCompiler: true
};
