import { ApiPromise } from '@polkadot/api/promise';
import { HttpProvider, WsProvider } from '@polkadot/rpc-provider';
import { TypeRegistry } from '@polkadot/types/create';
import { assert } from '@deip/toolbox';
import BaseChainService from './../../base/BaseChainService';
import SubstrateChainOperationsRegistry from './SubstrateChainOperationsRegistry';
import SubstrateTxBuilder from './SubstrateTxBuilder';
import SubstrateChainRpc from './rpc/SubstrateChainRpc';
import ChainTypes from './ChainTypes';
import { Metadata } from '@polkadot/metadata';
import SubstrateChainSeedAccount from './SubstrateChainSeedAccount';
import { verifySignature, isValidPrivKey } from './utils';


class SubstrateChainService extends BaseChainService {

  constructor({ connectionString, coreAsset }) {
    super({ connectionString, coreAsset });
  }

  init() {
    if (!this.isInited()) {

      const typesRegistry = new TypeRegistry();
      typesRegistry.register(ChainTypes);

      const provider = this._rpcConnectionString.indexOf('ws') !== 0 ? new HttpProvider(this._rpcConnectionString) : new WsProvider(this._rpcConnectionString);
      return ApiPromise.create({ provider, registry: typesRegistry })
        .then((chainNodeClient) => {
          this._chainNodeClient = chainNodeClient;
          this._chainOpsRegistry = new SubstrateChainOperationsRegistry(this._chainNodeClient, { coreAsset: this._coreAsset });
          this._chainRpc = new SubstrateChainRpc(this, { coreAsset: this._coreAsset });

          return Promise.all([
            this._chainNodeClient.rpc.system.chain(),
            this._chainNodeClient.rpc.system.name(),
            this._chainNodeClient.rpc.system.version(),
            this._chainNodeClient.rpc.state.getMetadata()
          ]);
        })
        .then(([chain, nodeName, nodeVersion, rpcMetadata]) => {
          this._chainNodeClient.registry.setMetadata(new Metadata(typesRegistry, rpcMetadata));
          console.log(`Connected to Substrate chain ${chain.toString()} using ${nodeName.toString()} v${nodeVersion.toString()}`);
          this._isInited = true;
          return this;
        });
    }
    return Promise.resolve(this);
  }

  getChainTxBuilder() {
    return new SubstrateTxBuilder(
      this.getChainNodeClient(), 
      this.getChainOperationsRegistry()
    );
  }

  generateChainSeedAccount({ username, password, privateKey }) {
    return new SubstrateChainSeedAccount({ username, password, privateKey });
  }

  isValidPrivKey(privKey) {
    return isValidPrivKey(`0x${privKey}`);
  }

  verifySignature(pubKey, msg, sig) {
    return verifySignature(`0x${pubKey}`, msg, sig);
  }

}

export default SubstrateChainService;
