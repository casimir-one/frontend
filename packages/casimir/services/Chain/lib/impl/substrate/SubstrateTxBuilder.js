import BaseTxBuilder from './../../base/BaseTxBuilder';
import SubstrateTx from './SubstrateTx';
import { assert } from '@casimir/toolbox';
import { daoIdToAddress } from './utils';


class SubstrateTxBuilder extends BaseTxBuilder {

  constructor(chainNodeClient, chainOpsRegistry, portalId) {
    super(chainNodeClient, chainOpsRegistry, portalId);
  }

  begin(opts = { ignorePortalSig: false }) {
    return this._chainNodeClient.rpc.state.getMetadata()
      .then((chainMetadata) => {
        const portalId = opts.ignorePortalSig ? null : this._portalId || null;
        this._tx = new SubstrateTx(null, chainMetadata.toHex(), portalId);
        return super.begin();
      });
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
  

  getBatchWeight(cmds) {
    const api = this._chainNodeClient;

    const batchCall = api.registry.createType('Call', {
      args: {
        "calls": Array.isArray(cmds)
          ? [].concat.apply([], cmds.map((cmd) => this.cmdToOps(cmd)))
          : this.cmdToOps(cmds)
      },
      callIndex: api.tx.utility.batchAll.callIndex
    }, api.tx.utility.batchAll.meta);
    const batchExtrinsic = api.registry.createType('Extrinsic', batchCall);

    return api.rpc.payment.queryInfo(batchExtrinsic.toHex())
      .then((queryInfo) => {
        return queryInfo.weight.toString();
      });
  }

}


export default SubstrateTxBuilder;