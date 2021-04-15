import { createEnum } from '@deip/toolbox';
import GrapheneTx from './impl/graphene/GrapheneTx';
import GrapheneTxBuilder from './impl/graphene/GrapheneTxBuilder';
import PolkadotTx from './impl/polkadot/PolkadotTx';
import PolkadotTxBuilder from './impl/polkadot/PolkadotTxBuilder';


const PROTOCOL = createEnum({
  GRAPHENE: 1,
  POLKADOT: 2
});

const PROTOCOL_INFO = {
  [PROTOCOL.GRAPHENE]: { txClass: GrapheneTx, txBuilderClass: GrapheneTxBuilder },
  [PROTOCOL.POLKADOT]: { txClass: PolkadotTx, txBuilderClass: PolkadotTxBuilder }
}


export {
  PROTOCOL,
  PROTOCOL_INFO
}