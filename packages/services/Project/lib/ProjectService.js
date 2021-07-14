import { Singleton } from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import deipRpc from '@deip/rpc-client';
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import { APP_PROPOSAL } from '@deip/constants'
import {
  CreateProjectCmd,
  UpdateProjectCmd,
  DeleteProjectCmd,
  CreateProposalCmd,
  CreateAccountCmd,
  JoinProjectTeamCmd,
  UpdateProposalCmd,
  LeaveProjectTeamCmd
} from '@deip/command-models';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { PROJECT_APPLICATION_STATUS } from '@deip/constants';
import { ChainService } from '@deip/chain-service';


// TODO: move to constants
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();
  proxydi = proxydi;
  deipRpc = deipRpc; // deprecated


  getProject(projectId) {
    return this.projectHttp.getProject(projectId);
  }

  getProjects(projectsIds) {
    return this.projectHttp.getProjects(projectsIds);
  }

  getTeamDefaultProject(teamId) {
    return this.projectHttp.getTeamDefaultProject(teamId);
  }

  createProject({ privKey }, {
    isAdmin,
    teamId,
    creator,
    domains,
    isPrivate,
    members,
    attributes,
    memoKey,
    formData
  },
    proposalInfo) {

    const { isProposal, isProposalApproved, proposalLifetime } =
      Object.assign({
        isProposal: false,
        isProposalApproved: true,
        proposalLifetime: proposalDefaultLifetime
      }, proposalInfo);

    const env = this.proxydi.get('env');
    const { TENANT, IS_TESTNET } = env;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        const isNewProjectTeam = teamId === null;
        const teamMembers = [];

        let projectId;
        return Promise.all([
          isNewProjectTeam
            ? Promise.resolve([])
            : this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false)
        ])
          .then(([refs]) => {
            const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
            teamMembers.push(...list);
            return txBuilder.begin();
          })
          .then(() => {

            if (isNewProjectTeam) {

              const authoritySetup = {
                auths: [],
                weight: 1
              };

              if (isAdmin) {
                authoritySetup.auths.push({ name: TENANT, weight: 1 })
              }

              const projectTeamMembers = members
                .filter(member => !teamMembers.some((m) => m === member))
                .reduce((acc, member) => {
                  return acc.some(m => m === member) ? acc : [...acc, member];
                }, [])
                .map(member => ({ name: member, weight: 1 }));

              authoritySetup.auths.push(...projectTeamMembers);

              const createAccountCmd = new CreateAccountCmd({
                isTeamAccount: true,
                fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
                creator: creator,
                authority: {
                  owner: authoritySetup,
                  active: authoritySetup
                },
                memoKey: memoKey,
                description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify({})).buffer)),
                attributes: []
              });

              txBuilder.addCmd(createAccountCmd);
              teamId = createAccountCmd.getProtocolEntityId();
            }

            const createProjectCmd = new CreateProjectCmd({
              teamId: teamId,
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
              domains: domains,
              isPrivate: isPrivate,
              isDefault: false,
              members: undefined,
              attributes: attributes
            });

            projectId = createProjectCmd.getProtocolEntityId();

            if (isProposal) {

              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_PROPOSAL,
                creator: creator,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [createProjectCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const projectProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: projectProposalId,
                  activeApprovalsToAdd: [creator]
                });

                txBuilder.addCmd(updateProposalCmd);
              }

            } else {
              txBuilder.addCmd(createProjectCmd);
            }

            return txBuilder.end();
          })
          .then((packedTx) => {
            return packedTx.signAsync(privKey, chainNodeClient);
          })
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': projectId });
            return this.projectHttp.createProject(msg);
          });
      });
  }


  updateProject({ privKey }, {
    projectId,
    teamId,
    isPrivate,
    members,
    updater,
    attributes,
    formData
  },
    proposalInfo) {

    const { isProposal, isProposalApproved, proposalLifetime } =
      Object.assign({
        isProposal: false,
        isProposalApproved: true,
        proposalLifetime: proposalDefaultLifetime
      }, proposalInfo);

    const env = this.proxydi.get('env');
    const { TENANT } = env;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        const teamMembers = [];
        return Promise.all([
          this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false),
          txBuilder.begin()
        ])
          .then(([refs]) => {
            const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
            teamMembers.push(...list);

            const joinedMembers = members ? members.filter(member => !teamMembers.includes(member)) : [];
            const leftMembers = members ? teamMembers.filter(member => !members.includes(member) && member != TENANT) : [];

            const invites = joinedMembers.map((invitee) => {
              const joinProjectTeamCmd = new JoinProjectTeamCmd({
                member: invitee,
                teamId: teamId,
                projectId: projectId
              });

              return joinProjectTeamCmd;
            });

            const leavings = leftMembers.map((leaving) => {
              const leaveProjectTeamCmd = new LeaveProjectTeamCmd({
                member: leaving,
                teamId: teamId,
                projectId: projectId
              });

              return leaveProjectTeamCmd;
            });


            const updateProjectCmd = new UpdateProjectCmd({
              entityId: projectId,
              teamId: teamId,
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
              isPrivate: isPrivate,
              members: undefined,
              attributes: attributes
            });


            if (isProposal) {

              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_UPDATE_PROPOSAL,
                creator: updater,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [updateProjectCmd, ...invites, ...leavings]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const projectUpdateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: projectUpdateProposalId,
                  activeApprovalsToAdd: [updater]
                });

                txBuilder.addCmd(updateProposalCmd);
              }

            } else {
              txBuilder.addCmd(updateProjectCmd);
              for (let i = 0; i < invites.length; i++) {
                txBuilder.addCmd(invites[i]);
              }
              for (let i = 0; i < leavings.length; i++) {
                txBuilder.addCmd(leavings[i]);
              }
            }

            return txBuilder.end();
          })
          .then((packedTx) => {
            return packedTx.signAsync(privKey, chainNodeClient);
          })
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': projectId });
            return this.projectHttp.updateProject(msg);
          });
      });
  }


  deleteProject(projectId) {
    const deleteProjectCmd = new DeleteProjectCmd({ entityId: projectId });
    const msg = new JsonDataMsg({ appCmds: [deleteProjectCmd] }, { 'entity-id': projectId });
    return this.projectHttp.deleteProject(msg);
  }

  // Change all methods to cmd

  getPublicProjectListing({
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

    return this.projectHttp.getPublicProjectListing(filter);
  }

  getUserProjectListing(username) {
    return this.projectHttp.getUserProjectListing(username);
  }

  getUserPublicProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => !p.is_private));
  }

  getUserPrivateProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.is_private));
  }

  getUserTeamsProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => !p.research_group.is_personal));
  }

  getUserPersonalProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.research_group.is_personal));
  }

  getTeamProjectListing(teamId) {
    return this.projectHttp.getTeamProjectListing(teamId);
  }

  getTenantProjectListing() {
    return this.projectHttp.getTenantProjectListing();
  }

  createProjectApplication(privKey, formData) {

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
          expiration_time: proposalDefaultLifetime,
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
          expiration_time: proposalDefaultLifetime,
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

        return this.blockchainService.signOperations([main_proposal_op, update_main_proposal_op], privKey, refBlock)
          .then((signedTx) => {
            formData.append('tx', JSON.stringify(signedTx));
            return this.projectHttp.createProjectApplication({ proposalId: main_proposal_external_id, formData })
          });
      });
  }

  editProjectApplication(proposalId, formData) {
    return this.projectHttp.editProjectApplication({ proposalId, formData })
  }

  approveProjectApplication(privKey, {
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
        return this.projectHttp.approveProjectApplication({ tx: signedTx })
      });
  }

  rejectProjectApplication(privKey, {
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
        return this.projectHttp.rejectProjectApplication({ tx: signedTx })
      });
  }

  deleteProjectApplication(privKey, {
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
        return this.projectHttp.deleteProjectApplication({ tx: signedTx })
      });
  }

  getPendingProjectApplications() {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.PENDING });
  }

  getPendingProjectApplicationsByProject(project) {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.PENDING, project });
  }

  getApprovedProjectApplications() {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.APPROVED });
  }

  getApprovedProjectApplicationsByProject(project) {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.APPROVED, project });
  }

  getRejectedProjectApplications() {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.REJECTED });
  }

  getRejectedProjectApplicationsByProject(project) {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.REJECTED, project });
  }

  getDeletedProjectApplications() {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.DELETED });
  }

  getDeletedProjectApplicationsByProject(project) {
    return this.projectHttp.getProjectApplications({ status: PROJECT_APPLICATION_STATUS.DELETED, project });
  }
}


export {
  ProjectService
};
