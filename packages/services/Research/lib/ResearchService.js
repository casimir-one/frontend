import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { Singleton } from '@deip/toolbox';
import { researchContentTypes } from './lists';
import { ResearchHttp } from './ResearchHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';

class ResearchService extends Singleton {
  researchHttp = ResearchHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  usersService = UsersService.getInstance();
  researchContentService = ResearchContentService.getInstance();
  proposalsService = ProposalsService.getInstance();

  createResearchViaOffchain(privKey, isProposal, {
      researchGroup,
      title,
      abstract,
      permlink,
      disciplines,
      isPrivate,
      members,
      reviewShare,
      compensationShare,
      extensions
    }, {
      videoSrc,
      milestones,
      partners,
      tenantCriterias
    }
  ) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
          research_group: researchGroup,
          title,
          abstract,
          permlink,
          disciplines,
          is_private: isPrivate,
          members,
          review_share: reviewShare,
          compensation_share: compensationShare,
          extensions
        }], refBlock)

        const offchainMeta = {
          videoSrc,
          milestones,
          partners,
          tenantCriterias
        };


        if (isProposal) {

          const proposal = {
            creator: researchGroup,
            proposedOps: [{ "op": create_research_op }],
            expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          return this.proposalsService.createProposal(privKey, false, proposal, refBlock)
            .then(({ tx: signedProposalTx }) => {
              return this.researchHttp.createResearch({ tx: signedProposalTx, offchainMeta, isProposal })
            })

        } else {

          return this.blockchainService.signOperations([create_research_op], privKey, refBlock)
            .then((signedTx) => {
              return this.researchHttp.createResearch({ tx: signedTx, offchainMeta, isProposal })
            })
        }

      });
  }

  createResearchTokenSaleViaOffchain(privKey, isProposal, {
    researchGroup,
    researchExternalId,
    startTime,
    endTime,
    share,
    softCap,
    hardCap,
    extensions
  }) {

    const op = {
      research_group: researchGroup,
      research_external_id: researchExternalId,
      start_time: startTime,
      end_time: endTime,
      share,
      soft_cap: softCap,
      hard_cap: hardCap,
      extensions
    }

    const offchainMeta = {};
    const operation = ['create_research_token_sale', op];

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
          return this.researchHttp.createResearchTokenSale({ tx: signedProposalTx, offchainMeta, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([operation], privKey)
        .then((signedTx) => {
          return this.researchHttp.createResearchTokenSale({ tx: signedTx, offchainMeta, isProposal })
      });

    }
  }


  createResearchApplicationViaOffchain({
    researcher,
    researcherPubKey,
    researcherPrivKey,
    admin
  }, {
      fee,
      researchGroupName,
      researchGroupPermlink,
      researchDescription,

      researchTitle,
      researchAbstract,
      researchPermlink,
      researchDisciplines,
      researchReviewShare,
      researchIsPrivate,

      propoalExpirationTime
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        // research group that will be used for the research
        const [research_group_external_id, create_research_group_op] = deipRpc.operations.createEntityOperation(['create_account',
          {
            fee: fee,
            creator: researcher,
            owner: {
              account_auths: [[researcher, 1], [admin, 1]], // requires admin approval
              key_auths: [],
              weight_threshold: 2
            },
            active: {
              account_auths: [],
              key_auths: [],
              weight_threshold: 0
            },
            posting: {
              account_auths: [],
              key_auths: [],
              weight_threshold: 0
            },
            memo_key: researcherPubKey,
            json_metadata: "",
            traits: [[
              "research_group_v1_0_0",
              {
                "_v": "1.0.0",
                "name": researchGroupName,
                "permlink": researchGroupPermlink,
                "description": researchDescription,
                "threshold_overrides": []
              }
            ]],
            extensions: []
          }], refBlock);


        // proposed research that requires admin approval
        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
            research_group: research_group_external_id,
            title: researchTitle,
            abstract: researchAbstract,
            permlink: researchPermlink,
            disciplines: researchDisciplines,
            is_private: researchIsPrivate,
            review_share: researchReviewShare,
            compensation_share: undefined,
            members: undefined,
            extensions: []
        }], refBlock);


        // update roles/rights for the research group
        const update_account_op = ['update_account', {
          account: research_group_external_id,
          owner: {
            account_auths: [[researcher, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active: {
            account_auths: [[researcher, 1], [admin, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          posting: undefined,
          memo_key: undefined,
          json_metadata: undefined,
          traits: undefined,
          extensions: []
        }];


        // research proposal with roles setup
        const [nested_proposal_external_id, nested_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researcher,
          proposed_ops: [
            { "op": create_research_op },
            { "op": update_account_op }
          ],
          expiration_time: propoalExpirationTime,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);


        // request signatures from researcher and admin
        const update_nested_proposal_op = ['update_proposal', {
          external_id: nested_proposal_external_id,
          posting_approvals_to_add: [],
          posting_approvals_to_remove: [],
          active_approvals_to_add: [],
          active_approvals_to_remove: [],
          owner_approvals_to_add: [admin, researcher],
          owner_approvals_to_remove: [],
          key_approvals_to_add: [],
          key_approvals_to_remove: [],
          extensions: []
        }];


        // proposal contract that requires signatures from researcher and admin
        const [main_proposal_external_id, main_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researcher,
          proposed_ops: [
            { "op": create_research_group_op },
            { "op": nested_proposal_op },
            { "op": update_nested_proposal_op }
          ],
          expiration_time: propoalExpirationTime,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);


        // researcher signs the contract by default
        const update_main_proposal_op = ['update_proposal', {
          external_id: main_proposal_external_id,
          posting_approvals_to_add: [],
          posting_approvals_to_remove: [],
          active_approvals_to_add: [],
          active_approvals_to_remove: [],
          owner_approvals_to_add: [researcher],
          owner_approvals_to_remove: [],
          key_approvals_to_add: [],
          key_approvals_to_remove: [],
          extensions: []
        }]

        return this.blockchainService.signOperations([main_proposal_op, update_main_proposal_op], researcherPrivKey, refBlock)
          .then((signedTx) => {
            return this.researchHttp.createResearchApplication({ tx: signedTx })
          });
      });
  }


  updateResearchViaOffchain(privKey, isProposal, {
    researchGroup,
    externalId,
    title,
    abstract,
    permlink,
    isPrivate,
    reviewShare,
    compensationShare,
    members,
    extensions
  }) {
      
    const op = {
      research_group: researchGroup,
      external_id: externalId,
      title,
      abstract,
      permlink,
      is_private: isPrivate,
      review_share: reviewShare,
      compensation_share: compensationShare,
      members,
      extensions
    }

    const operation = ['update_research', op];

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
          return this.researchHttp.updateResearch({ tx: signedProposalTx, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([operation], privKey)
        .then((signedTx) => {
          return this.researchHttp.updateResearch({ tx: signedTx, isProposal })
        });
    }
  }

  updateResearchOffchainMeta({ 
    researchExternalId, 
    milestones, 
    videoSrc, 
    partners, 
    tenantCriterias
  }) {

    const update = {
      milestones,
      videoSrc,
      partners,
      tenantCriterias
    };

    return this.researchHttp.updateResearchMeta(researchExternalId, update);
  }

  contributeToResearchTokenSaleViaOffchain(privKey, {
    researchExternalId,
    contributor,
    amount
  }) {

    const op = {
      research_external_id: researchExternalId,
      contributor,
      amount
    }

    const operation = ['contribute_to_token_sale', op];
    return this.blockchainService.signOperations([operation], privKey)
      .then((signedTx) => { 
        return this.researchHttp.contributeResearchTokenSale({ tx: signedTx })
      });
  }

  async getResearchContentOuterReferences(researchContent, acc) {
    const outerReferences = await deipRpc.api.getContentsReferToContentAsync(researchContent.id);

    for (let i = 0; i < outerReferences.length; i++) {
      const item = outerReferences[i];
      const {
        trx_id, block, timestamp, op
      } = item;
      const [opName, payload] = op;
      const {
        research_id: researchId,
        research_content_id: researchContentId,
        research_reference_id: referenceResearchId,
        research_content_reference_id: referenceResearchContentId
      } = payload;

      const outerRefResearch = await deipRpc.api.getResearchByIdAsync(researchId);
      const outerRefResearchGroup = await deipRpc.api.getResearchGroupByIdAsync(outerRefResearch.research_group_id);
      const outerRefResearchContent = await deipRpc.api.getResearchContentByIdAsync(researchContentId);

      const hash = outerRefResearchContent.content;
      const ref = await this.researchContentService.getContentRefByHash(outerRefResearch.external_id, hash);

      const authorsProfiles = await this.usersService.getEnrichedProfiles(outerRefResearchContent.authors);

      acc.push({
        isOuter: true,
        refType: 'out',
        to: referenceResearchContentId,
        researchGroup: outerRefResearchGroup,
        research: outerRefResearch,
        researchContent: { ...outerRefResearchContent, authorsProfiles },
        ref,
        contentType: this.getResearchContentType(outerRefResearchContent.content_type)
      });

      await this.getResearchContentOuterReferences(outerRefResearchContent, acc);
    }
  }

  async getResearchContentInnerReferences(researchContent, acc) {
    const innerReferences = await deipRpc.api.getContentReferencesAsync(researchContent.id);

    for (let i = 0; i < innerReferences.length; i++) {
      const item = innerReferences[i];
      const {
        trx_id, block, timestamp, op
      } = item;
      const [opName, payload] = op;
      const {
        research_id: researchId,
        research_content_id: researchContentId,
        research_reference_id: referenceResearchId,
        research_content_reference_id: referenceResearchContentId
      } = payload;

      const innerRefResearch = await deipRpc.api.getResearchByIdAsync(referenceResearchId);
      const innerRefResearchGroup = await deipRpc.api.getResearchGroupByIdAsync(innerRefResearch.research_group_id);
      const innerRefResearchContent = await deipRpc.api.getResearchContentByIdAsync(referenceResearchContentId);

      const hash = innerRefResearchContent.content;
      const ref = await this.researchContentService.getContentRefByHash(innerRefResearch.external_id, hash);

      const authorsProfiles = await this.usersService.getEnrichedProfiles(innerRefResearchContent.authors);

      acc.push({
        isInner: true,
        refType: 'in',
        to: researchContentId,
        researchGroup: innerRefResearchGroup,
        research: innerRefResearch,
        researchContent: { ...innerRefResearchContent, authorsProfiles },
        ref,
        contentType: this.getResearchContentType(innerRefResearchContent.content_type)
      });
      await this.getResearchContentInnerReferences(innerRefResearchContent, acc);
    }
  }

  async getResearchContentReferencesGraph(researchContentId) {
    const researchContent = await deipRpc.api.getResearchContentByIdAsync(researchContentId);
    const research = await deipRpc.api.getResearchByIdAsync(researchContent.research_id);
    const researchGroup = await deipRpc.api.getResearchGroupByIdAsync(research.research_group_id);

    const hash = researchContent.content;
    const ref = await this.researchContentService.getContentRefByHash(research.external_id, hash);

    const authorsProfiles = await this.usersService.getEnrichedProfiles(researchContent.authors);

    const root = {
      isRoot: true,
      refType: 'root',
      researchContent: { ...researchContent, authorsProfiles },
      research,
      researchGroup,
      ref,
      contentType: this.getResearchContentType(researchContent.content_type)
    };

    const outerReferences = [];
    await this.getResearchContentOuterReferences(researchContent, outerReferences);

    const innerReferences = [];
    await this.getResearchContentInnerReferences(researchContent, innerReferences);

    const references = [...innerReferences, root, ...outerReferences];
    const nodes = references.reduce((acc, ref) => {
      if (acc.some((r) => r.researchContent.id === ref.researchContent.id)) {
        return acc;
      }
      return [...acc, ref];
    }, []);

    const links = [];
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];

      if (ref.isRoot) continue;

      const type = ref.isOuter ? 'needs' : 'depends';

      const source = nodes.findIndex((node) => (ref.isOuter
        ? node.researchContent.id === ref.researchContent.id
        : node.researchContent.id === ref.to));

      const target = nodes.findIndex((node) => (ref.isOuter
        ? node.researchContent.id === ref.to
        : node.researchContent.id === ref.researchContent.id));

      const link = { source, target, type };

      links.push(link);
    }

    return { nodes, links };
  }

  getResearchContentType(type) {
    return researchContentTypes.find((t) => t.type === type);
  }

  getTopResearchesIds() {
    // return [ 21, 14, 24, 7, 10, 5, 0, 6, 26, 28, 15, 23, 9, 25, 20, 12 ];
    return [];
  }

  getResearchProfile(researchExternalId) {
    return this.researchHttp.getResearchProfile(researchExternalId);
  }

  getResearchWithOffchain(researchId) {
    let research;
    return deipRpc.api.getResearchByIdAsync(researchId)
      .then((item) => {
        research = item;
        return this.researchHttp.getResearchProfile(research.external_id)
      })
      .then((researchProfile) => {
        return {
          ...research,
          researchRef: researchProfile
        }
      })
  }
}

export {
  ResearchService
};
