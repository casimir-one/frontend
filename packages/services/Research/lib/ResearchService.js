import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
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
  
  getResearches(externalIds) {
    return this.researchHttp.getResearches(externalIds);
  }

  getResearchesByResearchGroup(researchGroupExternalId) {
    return deipRpc.api.getResearchesByResearchGroupAsync(researchGroupExternalId)
      .then((researches) => {
        return researches.length ? this.getResearches(researches.map(r => r.external_id)) : Promise.resolve([]);
      });
  }

  // DEPRECATED
  getResearchByAbsolutePermlink(groupPermlink, researchPermlink) {
    return deipRpc.api.getResearchByAbsolutePermlinkAsync(groupPermlink, researchPermlink)
      .then((research) => this.getResearch(research.external_id));
  }

  getPublicResearchListing({
    searchTerm,
    disciplines,
    organizations,
    researchAttributes
  }) {

    const filter = {
      searchTerm: searchTerm || "",
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

  createResearch({ privKey, username }, isProposal, formData) {

    const onchainData = JSON.parse(formData.get("onchainData"));
    let offchainMeta = JSON.parse(formData.get("offchainMeta"));

    const researchGroup = onchainData.researchGroup || null;
    const title = onchainData.title || "";
    // const abstract = oncshainData.abstract || "";
    const disciplines = onchainData.disciplines || [];
    const isPrivate = onchainData.isPrivate || false;
    const members = onchainData.members || [];
    const reviewShare = onchainData.reviewShare || undefined;
    const compensationShare = onchainData.compensationShare || undefined;
    const extensions = onchainData.extensions || [];
    
    const isNewResearchGroup = researchGroup === null;
    const isPersonalResearchGroup = researchGroup === username;

    const MIN_SECURITY_TOKEN_SYMBOL_SIZE = 3;
    const MAX_SECURITY_TOKEN_SYMBOL_SIZE = 6;

    let securityTokenSymbol = "";
    for (let i = 0; i < MAX_SECURITY_TOKEN_SYMBOL_SIZE; i++) {
      let word = title.split(/[ ,]+/)[i];
      if (!word) break;
      let ch = word[0];
      if (ch.toLowerCase() != ch.toUpperCase()) {
        securityTokenSymbol += ch.toUpperCase();
      }
    }

    return Promise.all([
      this.blockchainService.getRefBlockSummary(),
      isNewResearchGroup ? Promise.resolve([]) : deipRpc.api.getResearchGroupMembershipTokensAsync(researchGroup),
      deipRpc.api.getAssetBySymbolAsync(securityTokenSymbol)
    ])
      .then(([refBlock, rgtList, existingSecurityToken]) => {

        const { creator, memo, fee } = isNewResearchGroup ? { creator: onchainData.creator, memo: onchainData.memo, fee: onchainData.fee } : { creator: username };
        const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;

        offchainMeta = {
          research: {
            ...offchainMeta
          },
          researchGroup: {
            name: `${title} team`,
            description: ""
          }
        };
      
        const [research_group_external_id, create_research_group_op] = isNewResearchGroup ? deipRpc.operations.createEntityOperation(['create_account', {
          fee: fee,
          creator: creator,
          owner: {
            account_auths: [[creator, 1]], // requires tenant approval
            key_auths: [],
            weight_threshold: 1
          },
          active: {
            account_auths: [[creator, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active_overrides: [],
          memo_key: memo,
          json_metadata: undefined,
          traits: [[
            "research_group",
            {
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.researchGroup)).buffer)),
              extensions: []
            }
          ]],
          extensions: []
        }], refBlock) : [researchGroup, null];


        const researchMembers = isNewResearchGroup
          ? members && members.some(m => m == creator) ? [creator] : []
          : members
            ? members
              .filter(m => rgtList.some(rgt => rgt.owner == m))
              .reduce((acc, member) => {
                if (!acc.some(m => m == member)) {
                  return [...acc, member];
                }
                return acc;
              }, [])
            : undefined;

        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
          research_group: research_group_external_id,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.research)).buffer)),
          disciplines: disciplines || [],
          is_private: isPrivate || false,
          members: !isPersonalResearchGroup ? researchMembers : undefined,
          review_share: reviewShare || undefined,
          compensation_share: compensationShare || undefined,
          extensions: extensions || []
        }], refBlock);

        // Tokenize research by default
        function genRandomSymbol(length) {
          var result = '';
          var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          var charactersLength = characters.length;
          for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
        }
    
        const MAX_SECURITY_TOKENS_AMOUNT = 10000;
        const SECURITY_TOKEN_PRECISION = 0;
        const SECURITY_TOKEN_SYMBOL = existingSecurityToken || securityTokenSymbol.length < MIN_SECURITY_TOKEN_SYMBOL_SIZE ? genRandomSymbol(MAX_SECURITY_TOKEN_SYMBOL_SIZE) : securityTokenSymbol;

        const SECURITY_TOKEN_TO_ISSUE = `${MAX_SECURITY_TOKENS_AMOUNT} ${SECURITY_TOKEN_SYMBOL}`;
        const create_security_token_op = ['create_asset', {
          issuer: research_group_external_id,
          symbol: SECURITY_TOKEN_SYMBOL,
          precision: SECURITY_TOKEN_PRECISION,
          description: "",
          max_supply: MAX_SECURITY_TOKENS_AMOUNT,
          traits: [

            ['research_security_token', {
              research_external_id: research_external_id,
              research_group: research_group_external_id,
              extensions: []
            }],

            ['research_license_revenue', {
              holders_share: `100.00 %`,
              extensions: []
            }]
            
          ],
          extensions: []
        }];

        const issue_security_token_op = ['issue_asset', {
          issuer: research_group_external_id,
          amount: SECURITY_TOKEN_TO_ISSUE,
          recipient: research_group_external_id,
          memo: undefined,
          extensions: []
        }];


        const invites_ops = [];
        const invitees = members.filter(m => m != creator && !rgtList.some(rgt => rgt.owner == m)).reduce((acc, member) => {
          if (!acc.some(m => m == member)) {
            return [...acc, member];
          }
          return acc;
        }, []);

        for (let i = 0; i < invitees.length; i++) {

          const invitee = invitees[i];

          const join_research_group_membership_op = ['join_research_group_membership', {
            member: invitee,
            research_group: research_group_external_id,
            reward_share: '0.00 %',
            researches: [research_external_id],
            extensions: []
          }];

          const [proposal_external_id, create_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
            creator: research_group_external_id,
            proposed_ops: [
              { "op": join_research_group_membership_op }
            ],
            expiration_time: proposalExpiration,
            review_period_seconds: undefined,
            extensions: []
          }], refBlock);

          const update_proposal_op = ['update_proposal', {
            external_id: proposal_external_id,
            active_approvals_to_add: [creator],
            active_approvals_to_remove: [],
            owner_approvals_to_add: [],
            owner_approvals_to_remove: [],
            key_approvals_to_add: [],
            key_approvals_to_remove: [],
            extensions: []
          }];

          invites_ops.push(...[create_proposal_op, update_proposal_op]);
        }


        formData.delete("offchainMeta");
        formData.append("offchainMeta", JSON.stringify(offchainMeta));
        formData.append("isProposal", isProposal)

        if (isProposal) {

          const proposal = {
            creator: username,
            proposedOps: [{ "op": create_research_op }, { "op": create_security_token_op }, { "op": issue_security_token_op }, ...invites_ops.map((op) => { return { "op": op } })],
            expirationTime: proposalExpiration,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          const preOps = [];
          const postOps = [];

          if (isNewResearchGroup) {
            preOps.unshift(create_research_group_op);
          }

          return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock, preOps, postOps)
            .then(({ tx: signedProposalTx }) => {
              formData.append("tx", JSON.stringify(signedProposalTx))
              return this.researchHttp.createResearch({ researchExternalId: research_external_id, formData })
            })

        } else {

          const ops = [create_research_op, create_security_token_op, issue_security_token_op, ...invites_ops];

          if (isNewResearchGroup) {
            ops.unshift(create_research_group_op);
          }

          return this.blockchainService.signOperations(ops, privKey, refBlock)
            .then((signedTx) => {
              formData.append("tx", JSON.stringify(signedTx))
              return this.researchHttp.createResearch({ researchExternalId: research_external_id, formData })
            })
        }

      });
  }


  updateResearch({ privKey, username }, isProposal, formData) {

    const onchainData = JSON.parse(formData.get("onchainData"));
    let offchainMeta = JSON.parse(formData.get("offchainMeta"));

    const externalId = onchainData.externalId;
    const researchGroup = onchainData.researchGroup;
    // const title = onchainData.title || undefined;
    // const abstract = onchainData.abstract || undefined;
    const isPrivate = onchainData.isPrivate || undefined;
    const members = onchainData.members || undefined;
    const reviewShare = onchainData.reviewShare || undefined;
    const compensationShare = onchainData.compensationShare || undefined;
    const extensions = onchainData.extensions || undefined;

    const isPersonalResearchGroup = researchGroup === username;

    return Promise.all([
      this.blockchainService.getRefBlockSummary(),
      deipRpc.api.getResearchGroupMembershipTokensAsync(researchGroup),
      this.researchHttp.getResearchPendingInvites(externalId)
    ])
      .then(([refBlock, rgtList, researchInvites]) => {
        const newMembers = members ? members.filter(member => !rgtList.some(rgt => rgt.owner == member)) : [];
        const newInvites = newMembers.filter(member => !researchInvites.some(invite => invite.invitee == member));
        const proposalExpiration = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days;

        offchainMeta = {
          research: {
            ...offchainMeta
          }
        };

        const invites_ops = [];

        for (let i = 0; i < newInvites.length; i++) {
          let invitee = newInvites[i];

          const join_research_group_membership_op = ['join_research_group_membership', {
            member: invitee,
            research_group: researchGroup,
            reward_share: '0.00 %',
            researches: [externalId],
            extensions: []
          }];

          const [proposal_external_id, create_proposal_op] = deipRpc.operations.createEntityOperation(['create_proposal', {
            creator: researchGroup,
            proposed_ops: [
              { "op": join_research_group_membership_op }
            ],
            expiration_time: proposalExpiration,
            review_period_seconds: undefined,
            extensions: []
          }], refBlock);

          const update_proposal_op = ['update_proposal', {
            external_id: proposal_external_id,
            active_approvals_to_add: [username],
            active_approvals_to_remove: [],
            owner_approvals_to_add: [],
            owner_approvals_to_remove: [],
            key_approvals_to_add: [],
            key_approvals_to_remove: [],
            extensions: []
          }];

          invites_ops.push(...[create_proposal_op, update_proposal_op]);
        }

        const researchMembers = members
          ? members.filter(member => rgtList.some(rgt => rgt.owner == member) && !researchInvites.some(invite => invite.invitee == member))
            .reduce((acc, member) => {
              if (!acc.some(m => m == member)) {
                return [...acc, member];
              }
              return acc;
            }, [])
          : undefined;

        const update_research_op = ['update_research', {
          research_group: researchGroup,
          external_id: externalId,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.research)).buffer)),
          is_private: isPrivate || false,
          review_share: reviewShare || undefined,
          compensation_share: compensationShare || undefined,
          members: !isPersonalResearchGroup ? researchMembers : undefined,
          extensions: extensions || []
        }];

        formData.delete("offchainMeta");
        formData.append("offchainMeta", JSON.stringify(offchainMeta));
        formData.append("isProposal", isProposal);

        if (isProposal) {

          const proposal = {
            creator: username,
            proposedOps: [{ "op": update_research_op }, ...invites_ops.map((op) => { return { "op": op } })],
            expirationTime: proposalExpiration,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
            .then(({ tx: signedProposalTx }) => {
              formData.append("tx", JSON.stringify(signedProposalTx))
              return this.researchHttp.updateResearch({ researchExternalId: externalId, formData });
            })

        } else {

          return this.blockchainService.signOperations([update_research_op, ...invites_ops], privKey, refBlock)
            .then((signedTx) => {
              formData.append("tx", JSON.stringify(signedTx))
              return this.researchHttp.updateResearch({ researchExternalId: externalId, formData });
            });
        }
      })
  }

  createResearchApplication(researcherPrivKey, formData) {

    const researcher = formData.get("researcher");
    const tenant = formData.get("tenant");
    const researcherPubKey = formData.get("researcherPubKey");

    const fee = formData.get("researchGroupFee");

    const researchTitle = formData.get("researchTitle");
    const researchAbstract = formData.get("researchAbstract");
    const researchDisciplines = JSON.parse(formData.get("researchDisciplines"));
    
    const researchIsPrivate = formData.get("researchIsPrivate") === 'true';

    const proposalExpirationTime = formData.get("proposalExpirationTime");

    const offchainMeta = {
      research: { attributes: [] },
      researchGroup: {
        name: formData.get("researchGroupName"),
        description: formData.get("researchGroupDescription"),
      }
    }

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
                description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.researchGroup)).buffer)),
                extensions: []
              }
            ]],
            extensions: []
          }], refBlock);


        // proposed research that requires tenant approval
        const [research_external_id, create_research_op] = deipRpc.operations.createEntityOperation(['create_research', {
          research_group: research_group_external_id,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.research)).buffer)),
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
        formData.append('offchainMeta', JSON.stringify(offchainMeta));

        return this.blockchainService.signOperations([main_proposal_op, update_main_proposal_op], researcherPrivKey, refBlock)
          .then((signedTx) => {
            formData.append('tx', JSON.stringify(signedTx));            
            return this.researchHttp.createResearchApplication({ proposalId: main_proposal_external_id, formData })
          });
      });
  }

  editResearchApplication(proposalId, formData) {
    return this.researchHttp.editResearchApplication({ proposalId, formData })
  }

  approveResearchApplication(privKey, {
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

  rejectResearchApplication(privKey, {
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

  deleteResearchApplication(privKey, {
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
