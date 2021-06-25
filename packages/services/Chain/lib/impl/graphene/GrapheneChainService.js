import { assert } from '@deip/toolbox';
import GrapheneClient from '@deip/rpc-client';
import BaseChainService from './../../base/BaseChainService';
import GrapheneChainOperationsRegistry from './GrapheneChainOperationsRegistry';
import GrapheneTxBuilder from './GrapheneTxBuilder';
import GrapheneChainApi from './GrapheneChainApi';

class GrapheneChainService extends BaseChainService {

  _rpcConnectionString;
  _chainId;
  _reconnectTimeout = 3000;
  
  constructor({ connectionString, chainId }) {
    super();
    assert(!!connectionString, `Graphene FULL NODE connection string is not specified`);
    assert(!!chainId, `Graphene CHAIN ID is not specified`);
    this._rpcConnectionString = connectionString;
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
      this._chainOpsRegistry = new GrapheneChainOperationsRegistry(this._chainNodeClient);
      this._chainApi = new GrapheneChainApi(this);

      console.log(`Connected to Graphene chain ${this._chainId}`);
      this._isInited = true;
    }
    return Promise.resolve(this);
  }

  getChainTxBuilder() {
    return new GrapheneTxBuilder(this.getChainNodeClient(), this.getChainOperationsRegistry());
  }
  
}


export default GrapheneChainService;