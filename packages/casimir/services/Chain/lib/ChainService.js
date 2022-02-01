import { Singleton } from '@deip/toolbox';
import { PROTOCOL_CHAIN } from '@deip/constants';
import SubstrateChainService from './impl/substrate/SubstrateChainService';
import GrapheneChainService from './impl/graphene/GrapheneChainService';


class ChainService extends Singleton {

  constructor({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, PORTAL_ID }) {
    let impl;
    switch (CHAIN_PROTOCOL) {
      case PROTOCOL_CHAIN.SUBSTRATE: {
        impl = SubstrateChainService.getInstance({
          connectionString: DEIP_FULL_NODE_URL,
          coreAsset: CORE_ASSET,
          portalId: PORTAL_ID
        });
        break;
      }
      case PROTOCOL_CHAIN.GRAPHENE: {
        impl = GrapheneChainService.getInstance({
          connectionString: DEIP_FULL_NODE_URL,
          coreAsset: CORE_ASSET,
          chainId: CHAIN_ID,
          portalId: PORTAL_ID
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

  static getInstanceAsync({ PROTOCOL: CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, TENANT: PORTAL_ID }) {
    const chainService = ChainService.getInstance({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, PORTAL_ID });
    return chainService.init();
  }

}


export default ChainService;
