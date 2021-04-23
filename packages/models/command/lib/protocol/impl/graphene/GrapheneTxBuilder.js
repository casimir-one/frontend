import { PROTOCOL } from './../../constants';
import BaseTxBuilder from './../../base/BaseTxBuilder';
import GrapheneTx from './../graphene/GrapheneTx';


class GrapheneTxBuilder extends BaseTxBuilder {

  constructor(api) {
    super(api, PROTOCOL.GRAPHENE);
    this._tx = null;
  }

  begin({ expiration } = {}) {
    this.clear();

    let refBlockNum;
    let refBlockPrefix;

    return this._api.api.getDynamicGlobalPropertiesAsync()
      .then((res) => {
        refBlockNum = (res.last_irreversible_block_num - 1) & 0xFFFF;
        return this._api.api.getBlockHeaderAsync(res.last_irreversible_block_num);
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
    return this.pack();
  }

  getTxCtx() {
    const ctx = super.getTxCtx();
    return {
      ...ctx,
      refBlockNum: this._tx._impl.ref_block_num,
      refBlockPrefix: this._tx._impl.ref_block_prefix
    }
  }
}


export default GrapheneTxBuilder;