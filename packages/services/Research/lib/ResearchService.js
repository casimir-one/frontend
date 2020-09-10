import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { Singleton } from '@deip/toolbox';
import { researchContentTypes } from './lists';
import { RESEARCH_APPLICATION_STATUS } from './constants';
import { ResearchHttp } from './ResearchHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';

class ResearchService extends Singleton {
  researchHttp = ResearchHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  usersService = UsersService.getInstance();
  researchContentService = ResearchContentService.getInstance();
  proposalsService = ProposalsService.getInstance();


  getResearch(externalId) {
    return this.researchHttp.getResearch(externalId);
  }

  getPublicResearchListing({
    disciplines,
    organizations,
    researchAttributes
  }) {

    const filter = {
      disciplines: disciplines || [],
      organizations: organizations || [],
      researchAttributes: researchAttributes || []
    };

    return this.researchHttp.getPublicResearchListing(filter);
  }

  getUserResearchListing(username) {
    return this.researchHttp.getUserResearchListing(username);
  }

  getResearchGroupResearchListing(researchGroupExternalId) {
    return this.researchHttp.getResearchGroupResearchListing(researchGroupExternalId);
  }

  createResearchViaOffchain(privKey, isProposal, {
    researchGroup,
    title,
    abstract,
    disciplines,
    isPrivate,
    members,
    reviewShare,
    compensationShare,
    extensions
  }, offchainMeta) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
          research_group: researchGroup,
          title,
          abstract,
          disciplines,
          is_private: isPrivate,
          members,
          review_share: reviewShare,
          compensation_share: compensationShare,
          extensions
        }], refBlock)

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


  createResearchApplicationViaOffchain(researcherPrivKey, formData) {

    const researcher = formData.get("researcher");
    const tenant = formData.get("tenant");
    const researcherPubKey = formData.get("researcherPubKey");

    const fee = formData.get("researchGroupFee");
    const researchGroupName = formData.get("researchGroupName");
    const researchGroupDescription = formData.get("researchGroupDescription");

    const researchTitle = formData.get("researchTitle");
    const researchAbstract = formData.get("researchAbstract");
    const researchDisciplines = JSON.parse(formData.get("researchDisciplines"));
    
    const researchIsPrivate = formData.get("researchIsPrivate") === 'true';

    const proposalExpirationTime = formData.get("proposalExpirationTime");

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        // research group that will own the research
        const [research_group_external_id, create_research_group_op] = deipRpc.operations.createEntityOperation(['create_account',
          {
            fee: fee,
            creator: researcher,
            owner: {
              account_auths: [[researcher, 1], [tenant, 1]], // requires tenant approval
              key_auths: [],
              weight_threshold: 2
            },
            active: {
              account_auths: [],
              key_auths: [],
              weight_threshold: 0
            },
            active_overrides: [],
            memo_key: researcherPubKey,
            json_metadata: undefined,
            traits: [[
              "research_group",
              {
                name: researchGroupName,
                description: researchGroupDescription,
                extensions: []
              }
            ]],
            extensions: []
          }], refBlock);


        // proposed research that requires tenant approval
        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
          research_group: research_group_external_id,
          title: researchTitle,
          abstract: researchAbstract,
          disciplines: researchDisciplines,
          is_private: researchIsPrivate,
          review_share: undefined,
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
            account_auths: [[researcher, 1], [tenant, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active_overrides: undefined,
          memo_key: undefined,
          json_metadata: undefined,
          traits: undefined,
          extensions: []
        }];


        // research proposal with roles setup
        const [nested_proposal_external_id, nested_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researcher,
          proposed_ops: [
            { op: create_research_op },
            { op: update_account_op }
          ],
          expiration_time: proposalExpirationTime,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);


        // request signatures from researcher and tenant
        const update_nested_proposal_op = ['update_proposal', {
          external_id: nested_proposal_external_id,
          active_approvals_to_add: [],
          active_approvals_to_remove: [],
          owner_approvals_to_add: [tenant, researcher],
          owner_approvals_to_remove: [],
          key_approvals_to_add: [],
          key_approvals_to_remove: [],
          extensions: []
        }];


        // proposal contract that requires signatures from researcher and tenant
        const [main_proposal_external_id, main_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
          creator: researcher,
          proposed_ops: [
            { op: create_research_group_op },
            { op: nested_proposal_op },
            { op: update_nested_proposal_op }
          ],
          expiration_time: proposalExpirationTime,
          review_period_seconds: undefined,
          extensions: []
        }], refBlock);


        // researcher signs the contract by default
        const update_main_proposal_op = ['update_proposal', {
          external_id: main_proposal_external_id,
          active_approvals_to_add: [],
          active_approvals_to_remove: [],
          owner_approvals_to_add: [researcher],
          owner_approvals_to_remove: [],
          key_approvals_to_add: [],
          key_approvals_to_remove: [],
          extensions: []
        }]

        formData.append('proposalId', main_proposal_external_id);
        formData.append('researchExternalId', research_external_id);
        
        return this.blockchainService.signOperations([main_proposal_op, update_main_proposal_op], researcherPrivKey, refBlock)
          .then((signedTx) => {
            formData.append('tx', JSON.stringify(signedTx));
            return this.researchHttp.createResearchApplication({ proposalId: main_proposal_external_id, formData })
          });
      });
  }

  editResearchApplicationViaOffchain(proposalId, formData) {
    return this.researchHttp.editResearchApplication({ proposalId, formData })
  }

  approveResearchApplicationViaOffchain(privKey, {
    proposalId,
    tenant
  }) {

    const update_proposal_op = ['update_proposal', {
      external_id: proposalId,
      active_approvals_to_add: [],
      active_approvals_to_remove: [],
      owner_approvals_to_add: [tenant],
      owner_approvals_to_remove: [],
      key_approvals_to_add: [],
      key_approvals_to_remove: [],
      extensions: []
    }]

    return this.blockchainService.signOperations([update_proposal_op], privKey)
      .then((signedTx) => {
        return this.researchHttp.approveResearchApplication({ tx: signedTx })
      });
  }

  rejectResearchApplicationViaOffchain(privKey, {
    proposalId,
    tenant
  }) {

    const delete_proposal_op = ['delete_proposal', {
      external_id: proposalId,
      account: tenant,
      authority : 1,
      extensions: []
    }]

    return this.blockchainService.signOperations([delete_proposal_op], privKey)
      .then((signedTx) => {
        return this.researchHttp.rejectResearchApplication({ tx: signedTx })
      });
  }

  deleteResearchApplicationViaOffchain(privKey, {
    proposalId,
    researcher
  }) {

    const delete_proposal_op = ['delete_proposal', {
      external_id: proposalId,
      account: researcher,
      authority: 1,
      extensions: []
    }]

    return this.blockchainService.signOperations([delete_proposal_op], privKey)
      .then((signedTx) => {
        return this.researchHttp.deleteResearchApplication({ tx: signedTx })
      });
  }
  
  getPendingResearchApplications() {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.PENDING });
  }

  getPendingResearchApplicationsByResearcher(researcher) {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.PENDING, researcher });
  }

  getApprovedResearchApplications() {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.APPROVED });
  }

  getApprovedResearchApplicationsByResearcher(researcher) {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.APPROVED, researcher });
  }

  getRejectedResearchApplications() {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.REJECTED });
  }

  getRejectedResearchApplicationsByResearcher(researcher) {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.REJECTED, researcher });
  }

  getDeletedResearchApplications() {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.DELETED });
  }

  getDeletedResearchApplicationsByResearcher(researcher) {
    return this.researchHttp.getResearchApplications({ status: RESEARCH_APPLICATION_STATUS.DELETED, researcher });
  }

  updateResearchViaOffchain(privKey, isProposal, {
    researchGroup,
    externalId,
    title,
    abstract,
    isPrivate,
    reviewShare,
    compensationShare,
    members,
    extensions
  }) {
      
    const update_research_op = ['update_research', {
      research_group: researchGroup,
      external_id: externalId,
      title,
      abstract,
      is_private: isPrivate,
      review_share: reviewShare,
      compensation_share: compensationShare,
      members,
      extensions
    }];

    if (isProposal) {

      const proposal = {
        creator: researchGroup,
        proposedOps: [{ "op": update_research_op }],
        expirationTime: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('.')[0], // 7 days,
        reviewPeriodSeconds: undefined,
        extensions: []
      }

      return this.proposalsService.createProposal(privKey, false, proposal)
        .then(({ tx: signedProposalTx }) => {
          return this.researchHttp.updateResearch({ tx: signedProposalTx, isProposal })
        })

    } else {

      return this.blockchainService.signOperations([update_research_op], privKey)
        .then((signedTx) => {
          return this.researchHttp.updateResearch({ tx: signedTx, isProposal })
        });
    }
  }

  updateResearchOffchainMeta(researchExternalId, { attributes }) {
    const offchainMeta = { attributes };
    return this.researchHttp.updateResearchMeta(researchExternalId, offchainMeta);
  }

  /* TODO: Move this to InvestmentsService */
  contributeToResearchTokenSaleViaOffchain(privKey, {
    researchExternalId,
    contributor,
    amount,
    extensions
  }) {

    const contribute_to_token_sale_op = ['contribute_to_token_sale', {
      research_external_id: researchExternalId,
      contributor,
      amount,
      extensions
    }]

    return this.blockchainService.signOperations([contribute_to_token_sale_op], privKey)
      .then((signedTx) => { 
        return this.researchHttp.contributeResearchTokenSale({ tx: signedTx })
      });
  }

  /* TODO: Move this to ResearchContentService */
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

  /* TODO: Move this to ResearchContentService */
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

  /* TODO: Move this to ResearchContentService */
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

  /* TODO: Move this to ResearchContentService */
  getResearchContentType(type) {
    return researchContentTypes.find((t) => t.type === type);
  }

  /* [DEPRECATED] */
  getTopResearchesIds() {
    // return [ 21, 14, 24, 7, 10, 5, 0, 6, 26, 28, 15, 23, 9, 25, 20, 12 ];
    return [];
  }

  /* [DEPRECATED] */
  getResearchById(researchId) {
    return deipRpc.api.getResearchByIdAsync(researchId)
      .then((research) => this.getResearch(research.external_id))
      .then((research) => {
        return research;
      })
  }

  checkResearchExistenceByPermlink(researchGroupExternalId, title) {
    return deipRpc.api.checkResearchExistenceByPermlinkAsync(researchGroupExternalId, title);
  }

}

export {
  ResearchService
};
