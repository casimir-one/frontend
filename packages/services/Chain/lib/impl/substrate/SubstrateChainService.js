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
import { Metadata } from '@polkadot/metadata';
import { u8aToHex, isU8a } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';


class SubstrateChainService extends BaseChainService {

  constructor({ connectionString }) {
    super();
    assert(!!connectionString, `Substrate FULL NODE connection string is not specified`);
    this._rpcConnectionString = connectionString;
  }

  init() {
    if (!this.isInited()) {

      const typesRegistry = new TypeRegistry();
      typesRegistry.register(ChainTypes);

      const provider = this._rpcConnectionString.indexOf('ws') !== 0 ? new HttpProvider(this._rpcConnectionString) : new WsProvider(this._rpcConnectionString);
      return ApiPromise.create({ provider, registry: typesRegistry })
        .then((chainNodeClient) => {
          this._chainNodeClient = chainNodeClient;
          this._chainOpsRegistry = new SubstrateChainOperationsRegistry(this._chainNodeClient);
          this._chainApi = new SubstrateChainApi(this);

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
    return new SubstrateTxBuilder(this.getChainNodeClient(), this.getChainOperationsRegistry());
  }

  getAccountFromJson(json, password, options = { type: 'sr25519' }) {
    const keyring = new Keyring(options);
    const account = keyring.createFromJson(json);
    account.unlock(password);
    return account;
  }

  pubKeyToAddress(pubKey, addressFormat = 42) {
    const address = encodeAddress(isU8a(pubKey) ? u8aToHex(pubKey) : pubKey, addressFormat);
    return address;
  }

}

export default SubstrateChainService;
