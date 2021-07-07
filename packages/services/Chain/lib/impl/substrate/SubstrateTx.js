import BaseTx from './../../base/BaseTx';
import { PROTOCOL_CHAIN } from './../../constants';
import ChainTypes from './ChainTypes';
import { Metadata } from '@polkadot/metadata';
import { TypeRegistry } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';
import { assert } from '@deip/toolbox';


class SubstrateTx extends BaseTx {

  chainMetadata;

  constructor(trx) {
    if (!trx) {
      super();
    } else {
      const { tx, chainMetadata } = trx;
      this.chainMetadata = chainMetadata;
      const ops = [];
      const registry = new TypeRegistry();
      registry.register(ChainTypes);
      registry.setMetadata(new Metadata(registry, chainMetadata));
      const batchAll = registry.createType('Extrinsic', hexToU8a(tx));
      for (let i = 0; i < batchAll.method.args[0].length; i++) {
        const call = registry.createType('Call', hexToU8a(batchAll.method.args[0][i].toHex()), batchAll.method.args[0][i].meta);
        const extrinsic = registry.createType('Extrinsic', call);
        ops.push(extrinsic);
      }
      super(tx, ops);
    }
  }

  getChainMetadata() {
    return this.chainMetadata;
  }

  signAsync(keyring, chainNodeClient) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return chainNodeClient.derive.tx.signingInfo(keyring.address)
      .then((signingInfo) => {
        const signingMeta = {
          nonce: signingInfo.nonce,
          blockHash: signingInfo.header.hash,
          genesisHash: chainNodeClient.genesisHash,
          era: chainNodeClient.registry.createType('ExtrinsicEra', {
            current: signingInfo.header.number,
            period: signingInfo.mortalLength
          }),
          signedExtensions: chainNodeClient.registry.signedExtensions,
          runtimeVersion: chainNodeClient.runtimeVersion,
          version: chainNodeClient.extrinsicVersion
        };
        this.getTx().sign(keyring, signingMeta);
        return this;
      });
  }

  signByTenantAsync({ tenant, tenantPrivKey }, chainNodeClient) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    // TODO: add extension
    return Promise.resolve(this);
  }

  getRawTx() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return this.getTx().toHex();
  }

  getProtocolChain() {
    return PROTOCOL_CHAIN.SUBSTRATE; 
  };

  finalize({ chainNodeClient }) {
    if (!super.isFinalized()) {
      return chainNodeClient.rpc.state.getMetadata()
        .then((chainMetadata) => {
          const batchCall = chainNodeClient.registry.createType('Call', {
            args: { "calls": super.getOps() },
            callIndex: chainNodeClient.tx.utility.batchAll.callIndex,
          }, chainNodeClient.tx.utility.batchAll.meta);
          
          const tx = chainNodeClient.registry.createType('Extrinsic', batchCall);
          this.chainMetadata = chainMetadata.toHex();
          super.finalize(tx);
          return this;
        });
    } else {
      return Promise.resolve(this);
    }
  }

  serialize() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return SubstrateTx.Serialize(this);
  }

  deserialize(serialized) {
    return SubstrateTx.Deserialize(serialized);
  }

  static Serialize(tx) {
    assert(!!tx, "Transaction is not specified");
    const rawTx = tx.getRawTx(); 
    const chainMetadata = tx.getChainMetadata();
    return JSON.stringify({ tx: rawTx, chainMetadata });
  }

  static Deserialize(serialized) {
    const finalized = JSON.parse(serialized);
    return new SubstrateTx(finalized);
  }
  
}


export default SubstrateTx;