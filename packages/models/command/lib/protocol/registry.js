import { PROTOCOL } from './constants'
import GrapheneOperationsRegistry from './../protocol/impl/graphene/GrapheneOperationsRegistry';
import PolkadotOperationsRegistry from './../protocol/impl/polkadot/PolkadotOperationsRegistry';
import GrapheneTxBuilder from './../protocol/impl/graphene/GrapheneTxBuilder';
import PolkadotTxBuilder from './../protocol/impl/polkadot/PolkadotTxBuilder';
import { assert } from '@deip/toolbox';
import deipRpc from '@deip/rpc-client';


class ProtocolRegistry {

  constructor(protocol) {
    assert(!!protocol, "Protocol type is required");
    this._protocol = protocol;
  }

  
  getOperationsRegistry() {
    let opRegistry;
    
    switch (this._protocol) {
      case PROTOCOL.POLKADOT:
        opRegistry = new PolkadotOperationsRegistry();
        break;
      case PROTOCOL.GRAPHENE:
        opRegistry = new GrapheneOperationsRegistry(deipRpc);
        break;
      default:
        throw new Error(`No operations registry for ${this._protocol} protocol found`);
    }

    return opRegistry;
  }


  getTransactionsBuilder() {
    let txBuilder;

    switch (this._protocol) {
      case PROTOCOL.POLKADOT:
        txBuilder = new PolkadotTxBuilder();
        break;
      case PROTOCOL.GRAPHENE:
        txBuilder = new GrapheneTxBuilder(deipRpc);
        break;
      default:
        throw new Error(`No transactions builder for ${this._protocol} protocol found`);
    }

    return txBuilder;
  }

}


export { 
  ProtocolRegistry 
};