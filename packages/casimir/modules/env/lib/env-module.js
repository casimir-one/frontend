import axios from 'axios';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';

import Clipboard from 'v-clipboard';

const init = () => axios.get('/env')
  .then((res) => {
    const env = res.data;
    proxydi.register('env', env);
    window.env = res.data; // TODO: temp solution
    return ChainService.getInstanceAsync({
      DEIP_FULL_NODE_URL: env.DEIP_FULL_NODE_URL,
      CHAIN_ID: env.CHAIN_ID,
      PROTOCOL: env.PROTOCOL,
      CORE_ASSET: env.CORE_ASSET
    });
  })
  .then(() => proxydi.get('env'));

const install = (Vue, options, envData) => {
  if (install.installed) return;
  install.installed = true;

  if (options.proxydi) {
    proxydi.batchRegister(options.proxydi);
  }

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
