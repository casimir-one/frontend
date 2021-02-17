import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { ResearchNdaHttp } from './ResearchNdaHttp';
import { ProposalsService } from '@deip/proposals-service';
import { BlockchainService } from '@deip/blockchain-service';

class ResearchNdaService extends Singleton {
  researchNdaHttp = ResearchNdaHttp.getInstance();
  proposalsService = ProposalsService.getInstance();
  blockchainService = BlockchainService.getInstance();

  createResearchNda({ privKey, username }, {
    creator,
    parties,
    description,
    researchExternalId,
    startTime,
    endTime,
    extensions,
    tenant
  }) {

    const offchainMeta = {};

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [research_nda_external_id, create_research_nda_op] = deipRpc.operations.createEntityOperation(['create_research_nda', {
          creator: creator,
          parties: parties,
          description: description,
          research_external_id: researchExternalId,
          start_time: startTime,
          end_time: endTime,
          extensions: extensions
        }], refBlock);


        const proposal = {
          creator: username,
          proposedOps: [{ "op": create_research_nda_op }],
          expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
          reviewPeriodSeconds: undefined,
          extensions: [],
          approvers: [creator, tenant]
        }

        return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
          .then(({ tx: signedProposalTx }) => {
             return this.researchNdaHttp.createResearchNda({ tx: signedProposalTx, offchainMeta })
          })
      });

  }

  getResearchNda(externalId) {
    return this.researchNdaHttp.getResearchNda(externalId);
  }

  getResearchNdaListByCreator(creator) {
    return this.researchNdaHttp.getResearchNdaListByCreator(creator);
  }

  getResearchNdaListByResearch(researchExternalId) {
    return this.researchNdaHttp.getResearchNdaListByResearch(researchExternalId);
  }
}

export {
  ResearchNdaService
};
