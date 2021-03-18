import axios from 'axios';
import deipRpc from '@deip/rpc-client';
import { proxydi } from '@deip/proxydi';

export const getEnvConfig = () => {
  return axios.get('/env')
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
    .then((data) => ({
      install(Vue, options = {}) {
        if (options.proxydi) {
          proxydi.batchRegister(options.proxydi)
        }
        Vue.prototype.$env = data;
        Vue.$env = data;
      }
    }));
};
