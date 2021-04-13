import GrapheneOperationsRegistry from './protocol/graphene/GrapheneOperationsRegistry';
import PolkadotOperationsRegistry from './protocol/polkadot/PolkadotOperationsRegistry';
import deipRpc from '@deip/rpc-client';


// TODO: replace with registry service based on ENV vars 
const ProtocolOperationsRegistry = process.env.PROTOCOL == 'polkadot'
  ? new PolkadotOperationsRegistry()
  : new GrapheneOperationsRegistry(deipRpc);


export {
  ProtocolOperationsRegistry
}