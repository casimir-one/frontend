import BaseTx from './../../base/BaseTx';
import { PROTOCOL_CHAIN } from './../../constants';
import { assert } from '@deip/toolbox';


class GrapheneTx extends BaseTx {

  constructor(tx) {
    if (!tx) {
      super();
    } else {
      super(tx, tx.operations);
    }
  }

  signAsync(privKey, chainNodeClient) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    chainNodeClient.auth.signTransaction(this.getTx(), { owner: privKey });
    return Promise.resolve(this);
  }

  signByTenantAsync({ tenant, tenantPrivKey }, chainNodeClient) {
    assert(super.isFinalized(), 'Transaction is not finalized');
    chainNodeClient.auth.signTransaction(this.getTx(), {}, { tenant, tenantPrivKey });
    return Promise.resolve(this);
  }

  getRawTx() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return JSON.parse(JSON.stringify(this.getTx()));
  }

  getProtocolChain() {
    return PROTOCOL_CHAIN.GRAPHENE; 
  }

  finalize({ chainNodeClient }) {
    if (!super.isFinalized()) {
      let refBlockNum;
      let refBlockPrefix;

      return chainNodeClient.api.getDynamicGlobalPropertiesAsync()
        .then((res) => {
          refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
          return chainNodeClient.api.getBlockHeaderAsync(res.last_irreversible_block_num);
        })
        .then((res) => {
          refBlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
          const tx = {
            operations: super.getOps(),
            ref_block_num: refBlockNum,
            ref_block_prefix: refBlockPrefix,
            expiration: new Date(new Date().getTime() + 3e6).toISOString().split('.')[0], // 1 hour
            extensions: [],
            signatures: [],
            tenant_signature: undefined
          };
          super.finalize(tx);
          return this;
        });

    } else {
      return Promise.resolve(this);
    }
  }

  serialize() {
    assert(super.isFinalized(), 'Transaction is not finalized');
    return GrapheneTx.Serialize(this);
  }

  deserialize(serialized) {
    return GrapheneTx.Deserialize(serialized);
  }

  static Serialize(tx) {
    assert(!!tx, "Transaction is not specified");
    return JSON.stringify(tx.getRawTx());
  }

  static Deserialize(serialized) {
    const finalized = JSON.parse(serialized);
    return new GrapheneTx(finalized);
  }

}


export default GrapheneTx;