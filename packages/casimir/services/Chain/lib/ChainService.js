import { Singleton } from '@casimir.one/toolbox';
import { ProtocolChain } from '@casimir.one/platform-core';
import SubstrateChainService from './impl/substrate/SubstrateChainService';
// import GrapheneChainService from './impl/graphene/GrapheneChainService';


class ChainService extends Singleton {

  constructor({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, PORTAL_ID }) {
    let impl;
    switch (CHAIN_PROTOCOL) {
      case ProtocolChain.SUBSTRATE: {
        impl = SubstrateChainService.getInstance({
          connectionString: DEIP_FULL_NODE_URL,
          coreAsset: CORE_ASSET,
          portalId: PORTAL_ID
        });
        break;
      }
      case ProtocolChain.GRAPHENE: {
        // impl = GrapheneChainService.getInstance({
        //   connectionString: DEIP_FULL_NODE_URL,
        //   coreAsset: CORE_ASSET,
        //   chainId: CHAIN_ID,
        //   portalId: PORTAL_ID
        // });
        throw new Error(`Graphene is not supported at the moment`);
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

  static getInstanceAsync({ PROTOCOL: CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, PORTAL_ID }) {
    const chainService = ChainService.getInstance({ CHAIN_PROTOCOL, DEIP_FULL_NODE_URL, CHAIN_ID, CORE_ASSET, PORTAL_ID });
    return chainService.init();
  }

}


export default ChainService;
