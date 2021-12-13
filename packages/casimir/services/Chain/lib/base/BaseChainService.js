import { Singleton } from '@deip/toolbox';
import { assert } from '@deip/toolbox';
import fetch from 'cross-fetch';


class BaseChainService extends Singleton {
  _isInited = false;
  _rpcConnectionString;

  _chainNodeClient;
  _chainOpsRegistry;
  _chainRpc;
  _coreAsset;

  constructor({ connectionString, coreAsset }) {
    assert(!!connectionString, `Node rpc connection string is not specified`);
    assert(!!coreAsset && coreAsset.id && coreAsset.symbol && (coreAsset.precision || coreAsset.precision === 0), 
      `Chain Core Asset should be specified in format { id, symbol, precision }`);
    super();
    this._rpcConnectionString = connectionString;
    this._coreAsset = coreAsset;
  }

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

  getChainRpc() {
    assert(this.isInited() && !!this._chainRpc, `Chain RPC is not available until initialization`);
    return this._chainRpc;
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
      })
      .catch(error => {
        console.error(error);
        throw new Error(
          `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
        );
      })
  }

  generateChainSeedAccount({ username, password, privateKey }) {
    throw new Error("Not implemented exception!");
  }

  isValidPrivKey(privKey) {
    throw new Error("Not implemented exception!");
  }

  verifySignature(pubKey, msg, sig) {
    throw new Error("Not implemented exception!");
  }

}


export default BaseChainService;