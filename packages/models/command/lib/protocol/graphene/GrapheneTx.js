import BaseTx from './../base/BaseTx';
import deipRpc from '@deip/rpc-client';


class GrapheneTx extends BaseTx {
  constructor({
    operations,
    expiration,
    refBlockNum,
    refBlockPrefix,
    extensions,
    signatures,
    tenantSignature
  }) {

    super({ operations });

    this._impl = {
      operations: this._operations,
      ref_block_num: refBlockNum,
      ref_block_prefix: refBlockPrefix,
      expiration: expiration || new Date(new Date().getTime() + 3e6).toISOString().split('.')[0], // 1 hour
      extensions: extensions || [],
      signatures: signatures || [],
      tenant_signature: tenantSignature || undefined
    };

    if (this._impl.signatures.length)
      this._isSealed = true;
  }

  sign(privKey) {
    this._impl = deipRpc.auth.signTransaction(this._impl, { owner: privKey });
    return this;
  }

  serialize() {
    return GrapheneTx.Serialize(this);
  }

  deserialize(serialized) {
    return GrapheneTx.Deserialize(serialized);
  }

  static Serialize(tx) {
    if (!tx || !tx._impl) return null;
    return JSON.stringify(tx._impl);
  }

  static Deserialize(serialized) {
    const data = JSON.parse(serialized);
    return new GrapheneTx({
      operations: data.operations,
      refBlockNum: data.ref_block_num,
      refBlockPrefix: data.ref_block_prefix,
      expiration: data.expiration,
      extensions: data.extensions,
      signatures: data.signatures,
      tenantSignature: data.tenant_signature
    });
  }

}


export default GrapheneTx;