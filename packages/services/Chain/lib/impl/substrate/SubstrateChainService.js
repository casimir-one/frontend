import { ApiPromise } from '@polkadot/api/promise';
import { HttpProvider, WsProvider } from '@polkadot/rpc-provider';
import { TypeRegistry } from '@polkadot/types/create';
import { Keyring } from '@polkadot/api';
import { assert } from '@deip/toolbox';
import BaseChainService from './../../base/BaseChainService';
import SubstrateChainOperationsRegistry from './SubstrateChainOperationsRegistry';
import SubstrateTxBuilder from './SubstrateTxBuilder';
import SubstrateChainApi from './SubstrateChainApi';
import ChainTypes from './ChainTypes';


class SubstrateChainService extends BaseChainService {

  constructor({ connectionString }) {
    super();
    assert(!!connectionString, `Substrate FULL NODE connection string is not specified`);
    this._rpcConnectionString = connectionString;
  }

  init() {
    if (!this.isInited()) {
      const registry = new TypeRegistry();
      registry.register(ChainTypes);
      const provider = this._rpcConnectionString.indexOf('ws') !== 0 ? new HttpProvider(this._rpcConnectionString) : new WsProvider(this._rpcConnectionString);
      return ApiPromise.create({ provider, registry })
        .then((chainNodeClient) => {
          this._chainNodeClient = chainNodeClient;
          this._chainOpsRegistry = new SubstrateChainOperationsRegistry(this._chainNodeClient);
          this._chainApi = new SubstrateChainApi(this);

          return Promise.all([
            this._chainNodeClient.rpc.system.chain(),
            this._chainNodeClient.rpc.system.name(),
            this._chainNodeClient.rpc.system.version()
          ]);
        })
        .then(([chain, nodeName, nodeVersion]) => {
          console.log(`Connected to Substrate chain ${chain.toString()} using ${nodeName.toString()} v${nodeVersion.toString()}`);
          this._isInited = true;
          return this;
        });
    }
    return Promise.resolve(this);
  }

  getChainTxBuilder() {
    return new SubstrateTxBuilder(this.getChainNodeClient(), this.getChainOperationsRegistry());
  }

  getTestAccount() { // temp test (wip)
    const keyring = new Keyring({ type: 'sr25519' });
    const ALICE = keyring.createFromJson({ "encoded": "MFMCAQEwBQYDK2VwBCIEIJgxnU/4qVCMS7DPC1p412CgsggsAndeboI3CBb+3/9IkloiXZeqAGgtalm5Wxh4DBDXAyM26I80QrQjYfSmYBGhIwMhANQ1k8cV/dMcYRQavQSpn9aCLIVYhUzN45pWhOelbaJ9", "encoding": { "content": ["pkcs8", "sr25519"], "type": ["none"], "version": "3" }, "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "meta": { "isTesting": true, "name": "alice" } });
    ALICE.unlock();
    return ALICE;
  }

}

export default SubstrateChainService;
