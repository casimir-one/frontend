import {
  Singleton,
  createFormData,
  replaceFileWithName,
  createHash
} from '@deip/toolbox';
import { UserService } from '@deip/user-service';
import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg } from '@deip/message-models';
import {
  APP_PROPOSAL,
  CreateProposalCmd,
  CreateAccountCmd,
  UpdateProposalCmd,
  UpdateAccountCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class TeamService extends Singleton {
  proxydi = proxydi;

  teamHttp = TeamHttp.getInstance();

  userService = UserService.getInstance();

  createTeam(payload) {
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
    const description = createHash(attributes);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        let entityId;
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const createAccountCmd = new CreateAccountCmd({
              isTeamAccount: true,
              fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
              authority: {
                owner: authority,
                active: authority
              },
              creator,
              memoKey,
              description,
              attributes
            });

            txBuilder.addCmd(createAccountCmd);
            entityId = createAccountCmd.getProtocolEntityId();
            return txBuilder.end();
          })
          .then((packedTx) => {
            packedTx.sign(privKey);
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });
            return this.teamHttp.createTeam(msg);
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

      ownerAuth, // need clarification
      activeAuth // need clarification
    } = data;

    const formData = createFormData(data);

    const attributes = replaceFileWithName(data.attributes);
    const description = createHash(attributes);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder
          .begin()
          .then(() => {
            const updateAccountCmd = new UpdateAccountCmd({
              entityId,

              isTeamAccount: true,
              memoKey: undefined,

              attributes, // need clarification
              ownerAuth, // need clarification
              activeAuth, // need clarification
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
          .then((packedTx) => {
            packedTx.sign(privKey);
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });
            return this.teamHttp.updateTeam(msg);
          });
      });
  }

  getTeam(teamId) {
    return Promise.all([
      this.teamHttp.getTeam(teamId),
      this.userService.getUsersByTeam(teamId)
    ]).then(([team, members]) => ({
      ...team,
      members
    }));
  }

  getTeams(externalIds) {
    return Promise.all(externalIds.map((externalId) => this.getTeam(externalId)));
  }

  getTeamsListing(personal = false) {
    return this.teamHttp.getTeamsListing(personal);
  }

  getTeamsByUser(user) {
    return this.teamHttp.getTeamsByUser(user);
  }

  getTeamsByTenant(tenantId) {
    return this.teamHttp.getTeamsByTenant(tenantId);
  }
}

export {
  TeamService
};
