import { Singleton } from '@deip/toolbox';
import { PROTOCOL_CHAIN } from './constants';
import SubstrateChainService from './impl/substrate/SubstrateChainService';
import GrapheneChainService from './impl/graphene/GrapheneChainService';


class ChainService extends Singleton {

  constructor({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID }) {
    let impl;
    switch (CHAIN_PROTOCOL) {
      case PROTOCOL_CHAIN.SUBSTRATE: {
        impl = SubstrateChainService.getInstance({
          connectionString: DEIP_FULL_NODE_URL
        });
        break;
      }
      case PROTOCOL_CHAIN.GRAPHENE: {
        impl = GrapheneChainService.getInstance({
          connectionString: DEIP_FULL_NODE_URL,
          chainId: CHAIN_ID
        });
        break;
      }
      default: {
        throw new Error(`Unknown Protocol Chain ${CHAIN_PROTOCOL}`);
      }
    }

    return impl;
  }

  init() {
    return this.impl.init();
  }

  static getInstanceAsync({ PROTOCOL: CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID }) {
    const chainService = ChainService.getInstance({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID });
    return chainService.init();
  }

}


export default ChainService;