import BaseTxBuilder from './../../base/BaseTxBuilder';
import GrapheneTx from './../graphene/GrapheneTx';


class GrapheneTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry, portalId) {
    super(chainNodeClient, chainOpsRegistry, portalId);
  }

  begin() {
    this._tx = new GrapheneTx();
    return super.begin();
  }

  end() {
    return super.end({ chainNodeClient: this._chainNodeClient });
  }

}


export default GrapheneTxBuilder;