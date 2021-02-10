import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
import { Singleton } from '@deip/toolbox';
import { ExpressLicensingHttp } from './ExpressLicensingHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { ResearchService } from '@deip/research-service';

class ExpressLicensingService extends Singleton {
  expressLicensingHttp = ExpressLicensingHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();
  researchService = ResearchService.getInstance();


  createExpressLicensingRequest({ privKey, username }, {
    researchExternalId,
    licensee,
    licenser,
    terms,
    fee,
    expirationDate
  }, { licensePlan }) {

    const offchainMeta = { licensePlan };
    const termsHash = crypto.hexify(crypto.ripemd160(new TextEncoder('utf-8').encode(terms).buffer));

    return Promise.all([
      this.blockchainService.getRefBlockSummary(),
      this.researchService.getResearch(researchExternalId)
    ])
      .then(([refBlock, research]) => {

        const [research_license_external_id, create_research_license_op] = deipRpc.operations.createEntityOperation(['create_research_license', {
          research_external_id: researchExternalId,
          licenser: licenser,
          licensee: licensee,
          license_conditions: ["licensing_fee", {
            terms: termsHash,
            fee: fee,
            expiration_time: expirationDate
          }],
          extensions: []
        }], refBlock);

        const proposal = {
          creator: licensee,
          proposedOps: [{ "op": create_research_license_op }],
          expirationTime: expirationDate,
          reviewPeriodSeconds: undefined,
          extensions: []
        }

        return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
          .then(({ tx: signedProposalTx }) => {
            return this.expressLicensingHttp.createExpressLicensingRequest({ tx: signedProposalTx, offchainMeta })
          })
      })
  }

  
  getResearchLicense(externalId) {
    return this.expressLicensingHttp.getResearchLicense(externalId);
  }


  getResearchLicensesByLicensee(licensee) {
    return this.expressLicensingHttp.getResearchLicensesByLicensee(licensee);
  }


  getResearchLicensesByLicenser(licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenser(licenser);
  }


  getResearchLicensesByResearch(researchId) {
    return this.expressLicensingHttp.getResearchLicensesByResearch(researchId);
  }


  getResearchLicensesByLicenseeAndResearch(licensee, researchId) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndResearch(licensee, researchId);
  }


  getResearchLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndLicenser(licensee, licenser);
  }
  
}

export {
  ExpressLicensingService
};
