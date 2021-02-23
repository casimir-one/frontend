import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
import { Singleton } from '@deip/toolbox';
import { researchContentTypes } from './lists';
import { ResearchContentHttp } from './ResearchContentHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 100).toISOString().split('.')[0]; // 100 years

class ResearchContentService extends Singleton {
  researchContentHttp = ResearchContentHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  createResearchContent({ privKey, username }, isProposal, {
    researchExternalId,
    researchGroup,
    type,
    title,
    content,
    authors,
    references,
    extensions
  }) {

    const offchainMeta = { researchContent: { title } };

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {
        
        const [research_content_external_id, create_research_content_op] = deipRpc.operations.createEntityOperation(['create_research_content', {
          research_external_id: researchExternalId,
          research_group: researchGroup,
          type,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.researchContent)).buffer)),
          content,
          authors,
          references,
          extensions
        }], refBlock);

        if (isProposal) {

          const proposal = {
            creator: username,
            proposedOps: [{ "op": create_research_content_op }],
            expirationTime: proposalExpiration,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
            .then(({ tx: signedProposalTx }) => {
              return this.researchContentHttp.publishResearchContent({ tx: signedProposalTx, offchainMeta, isProposal })
            })

        } else {

          return this.blockchainService.signOperations([create_research_content_op], privKey, refBlock)
            .then((signedTx) => {
              return this.researchContentHttp.publishResearchContent({ tx: signedTx, offchainMeta, isProposal })
            });

        }

      })
  }

  getResearchContent(externalId) {
    return this.researchContentHttp.getResearchContent(externalId);
  }

  getResearchContentAndDraftsByResearch(researchExternalId) {
    return this.researchContentHttp.getResearchContentAndDraftsByResearch(researchExternalId);
  }
  
  getResearchContentsByTenant(tenantId) {
    return this.researchContentHttp.getResearchContentsByTenant(tenantId);
  }

  getResearchContentRef(refId) {
    return this.researchContentHttp.getResearchContentRef(refId);
  }

  createResearchContentDraftDar(researchExternalId) {
    return this.researchContentHttp.createResearchContentDraftDar(researchExternalId);
  }

  deleteResearchContentDraft(refId) {
    return this.researchContentHttp.deleteResearchContentDraft(refId);
  }

  unlockResearchContentDraft(refId) {
    return this.researchContentHttp.unlockResearchContentDraft(refId);
  }

  uploadResearchContentPackage(researchExternalId, formData) {
    return this.researchContentHttp.uploadResearchContentPackage(researchExternalId, formData);
  }

  getPublicResearchContentListing() {
    return this.researchContentHttp.getPublicResearchContentListing();
  }

  getResearchContentReferencesGraph(contentId) {
    return this.researchContentHttp.getResearchContentReferencesGraph(contentId);
  }

  getResearchContentType(type) {
    return researchContentTypes.find((t) => t.type === type);
  }
}

export {
  ResearchContentService
};
