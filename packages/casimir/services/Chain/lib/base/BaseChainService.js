import { isNumber, Singleton } from '@casimir/toolbox';
import { assert } from '@casimir/toolbox';
import fetch from 'cross-fetch';


class BaseChainService extends Singleton {
  _isInited = false;
  _rpcConnectionString;

  _chainNodeClient;
  _chainOpsRegistry;
  _chainRpc;
  _coreAsset;
  _portalId;

  constructor({ connectionString, coreAsset, portalId }) {
    assert(!!connectionString, `Node rpc connection string is not specified`);
    assert(!!coreAsset && isNumber(coreAsset.id) && coreAsset.symbol && isNumber(coreAsset.precision), 
      `Chain Core Asset should be specified in format { id, symbol, precision }`);
    super();
    this._rpcConnectionString = connectionString;
    this._coreAsset = coreAsset;
    this._portalId = portalId;
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

  getPortalId() {
    assert(this.isInited(), `Portal Id is not available until initialization`);
    return this._portalId;
  }

  getChainTxBuilder() {
    throw new Error("Not implemented exception!");
  }

  getChainInfo() { 
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