import { Singleton } from '@deip/toolbox';
import { assert } from '@deip/toolbox';
import fetch from 'cross-fetch';


class BaseChainService extends Singleton {
  _isInited = false;
  _rpcConnectionString;

  _chainNodeClient;
  _chainOpsRegistry;
  _chainApi;

  init() { 
    throw new Error("Not implemented exception!");
  }

  isInited() {
    return this._isInited;
  }

  getRpcConnectionString() {
    assert(!!this._rpcConnectionString, `RPC connection string is not specified`);
    return this._rpcConnectionString;
  }

  getChainNodeClient() {
    assert(this.isInited() && !!this._chainNodeClient, `Chain client is not available until initialization`);
    return this._chainNodeClient;
  }

  getChainOperationsRegistry() {
    assert(this.isInited() && !!this._chainOpsRegistry, `Chain ops registy is not available until initialization`);
    return this._chainOpsRegistry;
  }

  getChainApi() {
    assert(this.isInited() && !!this._chainApi, `Chain api is not available until initialization`);
    return this._chainApi;
  }

  getChainTxBuilder() {
    throw new Error("Not implemented exception!");
  }

  rpcToChainNode(method, params = []) {
    return fetch(this.getRpcConnectionString(), {
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method,
        params
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then((response) => response.json())
      .then(({ error, result }) => {
        if (error) {
          throw new Error(
            `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
          );
        }
        return result;
      });
  }
}


export default BaseChainService;