import BaseTxBuilder from './../../base/BaseTxBuilder';
import GrapheneTx from './../graphene/GrapheneTx';


class GrapheneTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry) {
    super(chainNodeClient, chainOpsRegistry);
    this._tx = null;
  }

  begin({ expiration } = {}) {
    this.clear();

    let refBlockNum;
    let refBlockPrefix;

    return this._chainNodeClient.api.getDynamicGlobalPropertiesAsync()
      .then((res) => {
        refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
        return this._chainNodeClient.api.getBlockHeaderAsync(res.last_irreversible_block_num);
      })
      .then((res) => {
        refBlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
        this._tx = new GrapheneTx({
          expiration,
          refBlockNum,
          refBlockPrefix
        });
      });
  }

  end() { 
    const packedTx = super.finalize();
    super.clear();
    return Promise.resolve(packedTx);
  }

}


export default GrapheneTxBuilder;