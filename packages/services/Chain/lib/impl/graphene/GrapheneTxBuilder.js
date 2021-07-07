import BaseTxBuilder from './../../base/BaseTxBuilder';
import GrapheneTx from './../graphene/GrapheneTx';


class GrapheneTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry) {
    super(chainNodeClient, chainOpsRegistry);
  }

  begin() {
    super.clear();
    this._tx = new GrapheneTx();
    return Promise.resolve(this);
  }

  end() { 
    return super.finalize({ chainNodeClient: this._chainNodeClient })
      .then((packedTx) => {
        super.clear();
        return packedTx;
      });
  }

}


export default GrapheneTxBuilder;