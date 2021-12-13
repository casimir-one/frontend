import BaseTxBuilder from './../../base/BaseTxBuilder';
import SubstrateTx from './SubstrateTx';
import { assert } from '@deip/toolbox';
import { daoIdToAddress } from './utils';


class SubstrateTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry) {
    super(chainNodeClient, chainOpsRegistry);
  }

  begin() {
    this._tx = new SubstrateTx();
    return super.begin();
  }

  end() {
    return this._tx.getTxSignersTree(this._chainNodeClient)
      .then((signersTree) => {

        const isAuthorized = (signer, daoAddress) => {
          if (signer.address === daoAddress) 
            return true;

          for (let i = 0; i < Object.keys(signer.children).length; i++) {
            const key = Object.keys(signer.children)[i];
            if (isAuthorized(signer.children[key], daoAddress))
              return true;
          }

          return false;
        }

        let hasSingleSigner = false;
        const daoSigners = this._tx.getTxSigners(this._chainNodeClient);
        for (let i = 0; i < Object.keys(signersTree).length; i++) {
          const key = Object.keys(signersTree)[i];
          hasSingleSigner = daoSigners.every((daoSigner) => isAuthorized(signersTree[key], daoIdToAddress(daoSigner.daoId, this._chainNodeClient)));
          if (hasSingleSigner) break;
        }

        assert(hasSingleSigner, `Transaction can't contain multi-account operations. Use 'Proposal' if you need a multi-account transaction.`);

        return super.end({ chainNodeClient: this._chainNodeClient });
      });
  }

}


export default SubstrateTxBuilder;