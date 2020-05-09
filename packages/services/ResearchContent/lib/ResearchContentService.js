import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { ResearchContentHttp } from './ResearchContentHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';


class ResearchContentService extends Singleton {
  researchContentHttp = ResearchContentHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  createResearchContentViaOffchain(privKey, isProposal, {
    researchExternalId,
    researchGroup,
    type,
    title,
    content,
    permlink,
    authors,
    references,
    foreignReferences,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {
        
        const [research_content_external_id, create_research_content_op] = deipRpc.operations.createEntityOperation(['create_research_content', {
          research_external_id: researchExternalId,
          research_group: researchGroup,
          type,
          title,
          content,
          permlink,
          authors,
          references,
          foreign_references: foreignReferences,
          extensions
        }], refBlock);

        const offchainMeta = {};

        if (isProposal) {

          const proposal = {
            creator: researchGroup,
            proposedOps: [{ "op": create_research_content_op }],
            expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          return this.proposalsService.createProposal(privKey, false, proposal, refBlock)
            .then(({ tx: signedProposalTx }) => {
              return this.researchContentHttp.createResearchContent({ tx: signedProposalTx, offchainMeta, isProposal })
            })

        } else {

          return this.blockchainService.signOperations([create_research_content_op], privKey, refBlock)
            .then((signedTx) => {
              return this.researchContentHttp.createResearchContent({ tx: signedTx, offchainMeta, isProposal })
            });

        }

      })
  }

  getContentRefById(refId) {
    return this.researchContentHttp.getContentRefById(refId);
  }

  getContentRefByHash(researchExternalId, hash) {
    return this.researchContentHttp.getContentRefByHash(researchExternalId, hash);
  }

  getContentRefs(researchExternalId) {
    return this.researchContentHttp.getContentRefs(researchExternalId);
  }

  createDarContent(researchExternalId) {
    return this.researchContentHttp.createDarContent(researchExternalId);
  }

  deleteContentDraft(refId) {
    return this.researchContentHttp.deleteContentDraft(refId);
  }

  unlockContentDraft(refId) {
    return this.researchContentHttp.unlockContentDraft(refId);
  }
}

export {
  ResearchContentService
};
