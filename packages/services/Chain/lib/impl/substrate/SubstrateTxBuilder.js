import BaseTxBuilder from './../../base/BaseTxBuilder';
import SubstrateTx from './SubstrateTx';


class SubstrateTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry) {
    super(chainNodeClient, chainOpsRegistry);
  }

  begin() {
    super.clear();
    this._tx = new SubstrateTx();
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


export default SubstrateTxBuilder;