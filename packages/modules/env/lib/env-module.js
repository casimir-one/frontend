import axios from 'axios';
import deipRpc from '@deip/rpc-client';
import { proxydi } from '@deip/proxydi';

const init = () => axios.get('/env')
  .then((res) => {
    const env = res.data;

    proxydi.register('env', env)
    window.env = res.data; // TODO: temp solution

    deipRpc.api.setOptions({
      url: env.DEIP_FULL_NODE_URL,
      reconnectTimeout: 3000
    });

    deipRpc.config.set('chain_id', env.CHAIN_ID);

    return env;
  })

const install = (Vue, options, envData) => {
  if (install.installed) return;
  install.installed = true;

  if (options.proxydi) {
    proxydi.batchRegister(options.proxydi)
  }

  Vue.prototype.$env = envData;
  Vue.$env = envData;
}

export const EnvModule = {
  name: 'EnvModule',
  deps: [],
  init,
  install
}
