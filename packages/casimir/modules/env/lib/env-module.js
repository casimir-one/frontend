import axios from 'axios';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';

import Clipboard from 'v-clipboard';

const init = async () => {
  const { data: env } = await axios.get('/env');

  await ChainService.getInstanceAsync({
    DEIP_FULL_NODE_URL: env.DEIP_FULL_NODE_URL,
    CHAIN_ID: env.CHAIN_ID,
    PROTOCOL: env.PROTOCOL,
    CORE_ASSET: env.CORE_ASSET
  });

  proxydi.register('env', env);
  window.env = env;

  return env;
};

const install = (Vue, options, envData) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    router,
    vuetify,
    i18n
  } = options;

  // for unusual external cases
  proxydi.batchRegister({
    store,
    router,
    vuetify,
    i18n
  });

  Vue.prototype.$env = envData;
  Vue.$env = envData;

  Vue.use(Clipboard);
};

export const EnvModule = {
  name: 'EnvModule',
  deps: [],
  init,
  install
};
