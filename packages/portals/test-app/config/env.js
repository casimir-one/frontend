const env = (process.env.DEIP_CONFIG || process.env.NODE_ENV === 'local')
  ? 'local'
  : process.env.NODE_ENV || 'development';

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({
  path: `${__dirname}/${
    // eslint-disable-next-line no-nested-ternary
    env === 'production' ? '.prod.env' : env === 'development' ? '.dev.env' : process.env.DEIP_CONFIG ? (`.${process.env.DEIP_CONFIG}.env`) : '.local.env'}`
});

const config = {
  NODE_ENV: process.env.NODE_ENV,
  DEIP_CLIENT_URL: process.env.DEIP_CLIENT_URL,

  DEIP_SERVER_URL: process.env.DEIP_SERVER_URL,
  DEIP_FULL_NODE_URL: process.env.DEIP_FULL_NODE_URL,
  DEIP_CHAIN_EXPLORER_URL: process.env.DEIP_CHAIN_EXPLORER_URL,
  TENANT: process.env.TENANT,
  CHAIN_ID: process.env.CHAIN_ID,
  DEIP_PAYMENT_SERVICE_URL: process.env.DEIP_PAYMENT_SERVICE_URL,

  PROTOCOL: process.env.PROTOCOL ? parseInt(process.env.PROTOCOL) : 0,
  CORE_ASSET: JSON.parse(process.env.CORE_ASSET),
  ACCOUNT_DEFAULT_FUNDING_AMOUNT: process.env.ACCOUNT_DEFAULT_FUNDING_AMOUNT || 0,
  FAUCET_ACCOUNT_USERNAME: process.env.FAUCET_ACCOUNT_USERNAME,

  SIG_SEED: process.env.SIG_SEED,

  APP_ID: process.env.APP_ID,

  VUE_APP_I18N_LOCALE: process.env.VUE_APP_I18N_LOCALE,
  VUE_APP_I18N_FALLBACK_LOCALE: process.env.VUE_APP_I18N_FALLBACK_LOCALE
};

module.exports = config;
