import {
  Singleton,
  createFormData,
  replaceFileWithName,
  genSha256Hash
} from '@deip/toolbox';
import { UserService } from '@deip/user-service';
import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import { APP_PROPOSAL } from '@deip/constants';
import crypto from '@deip/lib-crypto';
import {
  CreateProposalCmd,
  CreateAccountCmd,
  UpdateProposalCmd,
  UpdateAccountCmd,
  CreateProjectCmd,
  JoinTeamCmd,
  LeaveTeamCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class TeamService extends Singleton {
  proxydi = proxydi;
  teamHttp = TeamHttp.getInstance();
  userService = UserService.getInstance();

  createTeam(payload, isCreateDefaultProject = false) {
    const env = this.proxydi.get('env');
    const { TENANT, IS_TESTNET } = env;
    const {
      initiator: {
        memoKey,
        privKey,
        username: creator
      },
      ...data
    } = payload;

    const authority = {
      auths: [{ name: TENANT, weight: 1 }, { name: creator, weight: 1 }],
      weight: 1
    };

    const formData = createFormData(data);

    const attributes = replaceFileWithName(data.attributes);
    const description = genSha256Hash(attributes);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        let entityId;
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createAccountCmd = new CreateAccountCmd({
              isTeamAccount: true,
              fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
              authority: {
                owner: authority
              },
              creator,
              memoKey,
              description,
              attributes
            });

            txBuilder.addCmd(createAccountCmd);
            entityId = createAccountCmd.getProtocolEntityId();

            if (isCreateDefaultProject) {
              const createProjectCmd = new CreateProjectCmd({
                teamId: entityId,
                description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify([])).buffer)),
                domains: [],
                isDefault: true,
                attributes: []
              });
              txBuilder.addCmd(createProjectCmd);
            }

            const members = data.members.filter((m) => m !== creator);
            if (members.length > 0) {
              const invites = members.map((invitee) => {
                const joinTeamCmd = new JoinTeamCmd({
                  member: invitee,
                  teamId: entityId
                });

                return joinTeamCmd;
              });

              const createProposalCmd = new CreateProposalCmd({
                creator,
                type: APP_PROPOSAL.JOIN_TEAM_PROPOSAL,
                expirationTime: proposalDefaultLifetime,
                proposedCmds: [...invites]
              });

              txBuilder.addCmd(createProposalCmd);

              const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
              const updateProposalCmd = new UpdateProposalCmd({
                entityId: joinTeamProposalId,
                activeApprovalsToAdd: [creator]
              });

              txBuilder.addCmd(updateProposalCmd);
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });
            return this.teamHttp.create(msg);
          });
      });
  }

  updateTeam(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      ...data
    } = payload;

    const {
      entityId,
      proposalInfo: {
        isProposal = false,
        isProposalApproved = true,
        proposalLifetime = proposalDefaultLifetime
      } = {},
      ownerAuth // need clarification
    } = data;

    const formData = createFormData(data);

    const attributes = replaceFileWithName(data.attributes);
    const description = genSha256Hash(attributes);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const updateAccountCmd = new UpdateAccountCmd({
              entityId,

              isTeamAccount: true,
              memoKey: undefined,

              attributes, // need clarification
              ownerAuth, // need clarification
              description
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                creator,
                type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
                expirationTime: proposalLifetime,
                proposedCmds: [updateAccountCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: teamUpdateProposalId,
                  activeApprovalsToAdd: [creator]
                });

                txBuilder.addCmd(updateProposalCmd);
              }
            } else {
              txBuilder.addCmd(updateAccountCmd);
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });
            return this.teamHttp.update(msg);
          });
      });
  }

  joinTeam(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const joinTeamCmd = new JoinTeamCmd({
              member,
              teamId
            });

            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.JOIN_TEAM_PROPOSAL,
              expirationTime: proposalDefaultLifetime,
              proposedCmds: [joinTeamCmd]
            });

            txBuilder.addCmd(createProposalCmd);

            const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: joinTeamProposalId,
              activeApprovalsToAdd: [creator]
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });
            return this.teamHttp.joinTeam(msg);
          });
      });
  }

  leaveTeam(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const leaveTeamCmd = new LeaveTeamCmd({
              member,
              teamId
            });

            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.LEAVE_TEAM_PROPOSAL,
              expirationTime: proposalDefaultLifetime,
              proposedCmds: [leaveTeamCmd]
            });

            txBuilder.addCmd(createProposalCmd);

            const leaveTeamProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: leaveTeamProposalId,
              activeApprovalsToAdd: [creator]
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });
            return this.teamHttp.leaveTeam(msg);
          });
      });
  }

  getTeam(teamId) {
    return Promise.all([
      this.teamHttp.get(teamId),
      this.userService.getUsersByTeam(teamId)
    ]).then(([team, members]) => ({
      ...team,
      members
    }));
  }

  getTeams(teamsIds) {
    return this.teamHttp.getList(teamsIds);
  }

  getTeamsListing(withTenantTeam = false) {
    return this.teamHttp.getListing(withTenantTeam);
  }

  getTeamsByUser(user, withTenantTeam = false) {
    return this.teamHttp.getListByUser(user, withTenantTeam);
  }

  getTeamsByTenant(tenantId, withTenantTeam = false) {
    return this.teamHttp.getListByTenant(tenantId, withTenantTeam);
  }
}

export {
  TeamService
};
