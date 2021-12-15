import { assert, genMd5Hash } from '@deip/toolbox';
import GrapheneClient from '@deip/rpc-client';
import BaseChainService from './../../base/BaseChainService';
import GrapheneChainOperationsRegistry from './GrapheneChainOperationsRegistry';
import GrapheneTxBuilder from './GrapheneTxBuilder';
import GrapheneChainRpc from './rpc/GrapheneChainRpc';
import GrapheneChainSeedAccount from './GrapheneChainSeedAccount';
import GrapheneTx from './GrapheneTx';
import { isValidPrivKey, verifySignature } from './utils';

class GrapheneChainService extends BaseChainService {

  _chainId;
  _reconnectTimeout = 3000;
  
  constructor({ connectionString, chainId, coreAsset }) {
    super({ connectionString, coreAsset });
    assert(!!chainId, `Graphene CHAIN ID is not specified`);
    this._chainId = chainId;
  }

  init() {
    if (!this.isInited()) {
      GrapheneClient.config.set('chain_id', this._chainId);
      GrapheneClient.api.setOptions({
        url: this._rpcConnectionString,
        reconnectTimeout: this._reconnectTimeout
      });

      this._chainNodeClient = GrapheneClient;
      this._chainOpsRegistry = new GrapheneChainOperationsRegistry(this._chainNodeClient, { coreAsset: this._coreAsset });
      this._chainRpc = new GrapheneChainRpc(this, { coreAsset: this._coreAsset });

      console.log(`Connected to Graphene chain ${this._chainId}`);
      this._isInited = true;
    }
    return Promise.resolve(this);
  }

  getChainInfo() {
    return { 
      TxClass: GrapheneTx,
      metadata: {
        chainId: this._chainId
      }
    };
  }

  getChainTxBuilder() {
    return new GrapheneTxBuilder(this.getChainNodeClient(), this.getChainOperationsRegistry());
  }
 
  generateChainSeedAccount({ username, password, privateKey }) {
    return new GrapheneChainSeedAccount({ username, password, privateKey });
  }

  isValidPrivKey(privKey) {
    return isValidPrivKey(privKey);
  }

  verifySignature(pubKey, msg, sig) {
    return verifySignature(pubKey, genMd5Hash(msg), sig);
  }

}


export default GrapheneChainService;