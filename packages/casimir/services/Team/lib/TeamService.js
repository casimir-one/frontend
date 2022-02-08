import {
  createFormData,
  replaceFileWithName,
  genSha256Hash,
  createInstanceGetter,
  isBoolean
} from '@deip/toolbox';
import { UserService } from '@deip/user-service';
import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import { APP_PROPOSAL } from '@deip/constants';
import {
  CreateProposalCmd,
  CreateDaoCmd,
  AcceptProposalCmd,
  UpdateDaoCmd,
  CreateProjectCmd,
  AddDaoMemberCmd,
  RemoveDaoMemberCmd,
  TransferAssetCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class TeamService {
  proxydi = proxydi;
  teamHttp = TeamHttp.getInstance();
  userService = UserService.getInstance();

  async createTeam(payload, isCreateDefaultProject = false) {
    const env = this.proxydi.get('env');
    const { TENANT, CORE_ASSET, ACCOUNT_DEFAULT_FUNDING_AMOUNT } = env;
    const {
      initiator: {
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
            const createDaoCmd = new CreateDaoCmd({
              isTeamAccount: true,
              fee: { ...CORE_ASSET, amount: 0 },
              authority: {
                owner: authority
              },
              creator,
              description,
              attributes
            });

            txBuilder.addCmd(createDaoCmd);
            entityId = createDaoCmd.getProtocolEntityId();

            if (ACCOUNT_DEFAULT_FUNDING_AMOUNT) {
              const transferAssetCmd = new TransferAssetCmd({
                from: creator,
                to: entityId,
                asset: { ...CORE_ASSET, amount: ACCOUNT_DEFAULT_FUNDING_AMOUNT }
              });
              txBuilder.addCmd(transferAssetCmd);
            }

            if (isCreateDefaultProject) {
              const createProjectCmd = new CreateProjectCmd({
                teamId: entityId,
                description: genSha256Hash([]),
                domains: [],
                isDefault: true,
                attributes: []
              });
              txBuilder.addCmd(createProjectCmd);
            }

            const members = data.members.filter((m) => m !== creator);
            if (members.length > 0) {
              const invites = members.map((invitee) => {
                const addTeamMemberCmd = new AddDaoMemberCmd({
                  member: invitee,
                  teamId: entityId,
                  isThresholdPreserved: true
                });

                return addTeamMemberCmd;
              });

              const createProposalCmd = new CreateProposalCmd({
                creator,
                type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
                expirationTime: proposalDefaultLifetime,
                proposedCmds: [...invites]
              });

              txBuilder.addCmd(createProposalCmd);

              const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
              const updateProposalCmd = new AcceptProposalCmd({
                entityId: joinTeamProposalId,
                account: creator
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

  async updateTeam(payload) {
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
      } = {}
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
            const updateDaoCmd = new UpdateDaoCmd({
              entityId,
              isTeamAccount: true,
              attributes, // need clarification
              description
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                creator,
                type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
                expirationTime: proposalLifetime,
                proposedCmds: [updateDaoCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: teamUpdateProposalId,
                  account: creator
                });

                txBuilder.addCmd(updateProposalCmd);
              }
            } else {
              txBuilder.addCmd(updateDaoCmd);
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

  async addTeamMember(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member,
      isThresholdPreserved
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const addTeamMemberCmd = new AddDaoMemberCmd({
              member,
              teamId,
              isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
            });

            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
              expirationTime: proposalDefaultLifetime,
              proposedCmds: [addTeamMemberCmd]
            });

            txBuilder.addCmd(createProposalCmd);

            const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new AcceptProposalCmd({
              entityId: joinTeamProposalId,
              account: creator
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });
            return this.teamHttp.addTeamMember(msg);
          });
      });
  }

  async removeTeamMember(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member,
      isThresholdPreserved
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const removeDaoMemberCmd = new RemoveDaoMemberCmd({
              member,
              teamId,
              isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
            });

            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.REMOVE_DAO_MEMBER_PROPOSAL,
              expirationTime: proposalDefaultLifetime,
              proposedCmds: [removeDaoMemberCmd]
            });

            txBuilder.addCmd(createProposalCmd);

            const leaveTeamProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new AcceptProposalCmd({
              entityId: leaveTeamProposalId,
              account: creator
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });
            return this.teamHttp.removeTeamMember(msg);
          });
      });
  }

  async getTeam(teamId) {
    const [teamResponse, membersResponse] = await Promise.all([
      this.teamHttp.get(teamId),
      this.userService.getUsersByTeam(teamId)
    ]);

    return {
      ...teamResponse,
      data: {
        ...teamResponse.data,
        members: membersResponse.data.items
      }
    };
  }

  async getTeams(teamsIds) {
    return this.teamHttp.getList(teamsIds);
  }

  async getTeamsListing(withPortalTeam = false) {
    return this.teamHttp.getListing(withPortalTeam);
  }

  async getTeamsByUser(user, withPortalTeam = false) {
    return this.teamHttp.getListByUser(user, withPortalTeam);
  }

  async getTeamsByPortal(portalId, withPortalTeam = false) {
    return this.teamHttp.getListByPortal(portalId, withPortalTeam);
  }

  /** @type {() => TeamService} */
  static getInstance = createInstanceGetter(TeamService);
}
