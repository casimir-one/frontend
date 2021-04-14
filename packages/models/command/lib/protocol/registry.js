import GrapheneOperationsRegistry from './../protocol/graphene/GrapheneOperationsRegistry';
import PolkadotOperationsRegistry from './../protocol/polkadot/PolkadotOperationsRegistry';
import { assert } from '@deip/toolbox';
import deipRpc from '@deip/rpc-client';


class ProtocolRegistry {

  constructor(protocolType) {
    assert(!!protocolType, "Protocol type is required");
    this._protocolType = protocolType;
  }

  getOperationsRegistry() {
    let operationsRegistry;
    
    switch (this._protocolType) {
      case 'polkadot':
        operationsRegistry = new PolkadotOperationsRegistry();
        break;
      case 'graphene':
        operationsRegistry = new GrapheneOperationsRegistry(deipRpc);
        break;
      default:
        throw new Error(`No operations registry for ${this._protocolType} protocol found`);
    }

    return operationsRegistry;
  }

}

export default ProtocolRegistry;