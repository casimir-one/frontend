import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { ResearchGroupService } from '@deip/research-group-service';
import { Singleton } from '@deip/toolbox';
import { RESEARCH_APPLICATION_STATUS } from './constants';
import { ResearchHttp } from './ResearchHttp';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { proxydi } from '@deip/proxydi';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ResearchService extends Singleton {
  researchHttp = ResearchHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  usersService = UsersService.getInstance();
  researchContentService = ResearchContentService.getInstance();
  proposalsService = ProposalsService.getInstance();
  researchGroupService = ResearchGroupService.getInstance();
  proxydi = proxydi;


  getResearch(externalId) {
    return this.researchHttp.getResearch(externalId);
  }
  
  getResearches(externalIds) {
    return this.researchHttp.getResearches(externalIds);
  }

  getPublicResearchListing({
    searchTerm,
    disciplines,
    organizations,
    researchAttributes,
    tenantIds
  }) {

    const filter = {
      searchTerm: searchTerm || "",
      disciplines: disciplines || [],
      organizations: organizations || [],
      researchAttributes: researchAttributes || [],
      tenantIds: tenantIds || []
    };

    return this.researchHttp.getPublicResearchListing(filter);
  }

  getUserResearchListing(username) {
    return this.researchHttp.getUserResearchListing(username);
  }

  getUserPublicProjects(username) {
    return this.researchHttp.getUserResearchListing(username)
      .then((projects) => projects.filter((p) => !p.is_private));
  }

  getUserPrivateProjects(username) {
    return this.researchHttp.getUserResearchListing(username)
      .then((projects) => projects.filter((p) => p.is_private));
  }

  getUserTeamsProjects(username) {
    return this.researchHttp.getUserResearchListing(username)
      .then((projects) => projects.filter((p) => !p.research_group.is_personal));
  }

  getUserPersonalProjects(username) {
    return this.researchHttp.getUserResearchListing(username)
      .then((projects) => projects.filter((p) => p.research_group.is_personal));
  }

  getResearchGroupResearchListing(researchGroupExternalId) {
    return this.researchHttp.getResearchGroupResearchListing(researchGroupExternalId);
  }

  getTenantResearchListing(tenantId) {
    return this.researchHttp.getTenantResearchListing(tenantId);
  }

  createResearch({ privKey, username }, isProposal, formData, isTokenized = true) {
    
    const tenant = this.proxydi.get('env').TENANT;
    const onchainData = JSON.parse(formData.get("onchainData"));
    let offchainMeta = JSON.parse(formData.get("offchainMeta"));
    
    const researchGroup = onchainData.researchGroup || null;
    const title = onchainData.title || "";
    // const abstract = onchainData.abstract || "";
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
        const ops = [];

        offchainMeta = {
          research: {
            ...offchainMeta
          },
          researchGroup: {
            name: `${title} team`,
            description: ""
          }
        };

        formData.delete("offchainMeta");
        formData.append("offchainMeta", JSON.stringify(offchainMeta));
        formData.append("isProposal", isProposal)
      
        const [research_group_external_id, create_research_group_op] = isNewResearchGroup ? deipRpc.operations.createEntityOperation(['create_account', {
          fee: fee,
          creator: creator,
          owner: {
            account_auths: [[tenant, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active: {
            account_auths: [[tenant, 1]],
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

        ops.push(create_research_op);

        if (isTokenized) {
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

          ops.push(create_security_token_op);
          ops.push(issue_security_token_op);
        }


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

        ops.push(...invites_ops);

        if (isProposal) {
          
          const proposal = {
            creator: username,
            proposedOps: ops.map(op => { return {"op": op }}),
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

  deleteResearch(externalId) {
    return this.researchHttp.deleteResearch(externalId);
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
          expiration_time: proposalExpiration,
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
          expiration_time: proposalExpiration,
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
}

export {
  ResearchService
};
