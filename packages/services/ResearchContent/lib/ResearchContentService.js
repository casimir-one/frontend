import crypto from '@deip/lib-crypto';
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

    // TODO: move buffer hash serializer
    let encodeUint8Arr = (inputString) => new TextEncoder('utf-8').encode(inputString);
    let externalId = crypto.hexify(crypto.ripemd160(encodeUint8Arr(`${researchExternalId}${researchGroup}${type}${title}${content}${permlink}${authors}${JSON.stringify(references)}${new Date().getTime()}`).buffer));

    const op = {
      external_id: externalId,
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
    }

    const offchainMeta = {};
    const operation = ['create_research_content', op];

    if (isProposal) {

      const proposal = {
        creator: researchGroup,
        proposedOps: [{ "op": operation }],
        expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal(privKey, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          return this.researchContentHttp.createResearchContent({ tx: signedProposalTx, offchainMeta, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([operation], privKey)
        .then((signedTx) => {
          return this.researchContentHttp.createResearchContent({ tx: signedTx, offchainMeta, isProposal })
        });

    }
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
