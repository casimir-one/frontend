import crypto from '@deip/lib-crypto';
import { Singleton } from '@deip/toolbox';
import { UsersService } from '@deip/users-service';
import { proxydi } from '@deip/proxydi';
import { MultipartFormDataMessage } from '@deip/request-models';
import {
  APP_PROPOSAL,
  ProtocolRegistry,
  CreateProposalCmd,
  CreateAccountCmd,
  UpdateProposalCmd,
  UpdateAccountCmd
} from '@deip/command-models';
import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class TeamService extends Singleton {
  proxydi = proxydi;

  teamHttp = TeamHttp.getInstance();

  usersService = UsersService.getInstance();

  createTeam({ privKey }, {
    creator,
    memoKey,
    attributes,
    formData
  }) {
    const { TENANT } = this.proxydi.get('env');
    const { PROTOCOL } = this.proxydi.get('env');
    const { IS_TESTNET } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    let teamId;

    return txBuilder.begin()
      .then(() => {
        const createAccountCmd = new CreateAccountCmd({
          isTeamAccount: true,
          fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
          creator,
          authority: {
            owner: {
              auths: [{ name: TENANT, weight: 1 }],
              weight: 1
            },
            active: {
              auths: [{ name: TENANT, weight: 1 }],
              weight: 1
            }
          },
          memoKey,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          attributes
        }, txBuilder.getTxCtx());

        txBuilder.addCmd(createAccountCmd);

        teamId = createAccountCmd.getProtocolEntityId();

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': teamId });
        return this.teamHttp.createTeam(msg);
      });
  }

  updateTeam({ privKey }, {
    teamId,
    accountOwnerAuth,
    accountActiveAuth,
    memoKey,
    updater,
    formData,
    attributes
  }, proposalInfo) {
    const { isProposal, isProposalApproved, proposalLifetime } = {
      isProposal: false,
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };

    const { PROTOCOL } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    return txBuilder.begin()
      .then(() => {
        const updateAccountCmd = new UpdateAccountCmd({
          isTeamAccount: true,
          entityId: teamId,
          creator: updater,
          ownerAuth: accountOwnerAuth,
          activeAuth: accountActiveAuth,
          memoKey,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          attributes
        }, txBuilder.getTxCtx());

        if (isProposal) {
          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
            creator: updater,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [updateAccountCmd]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);

          if (isProposalApproved) {
            const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: teamUpdateProposalId,
              activeApprovalsToAdd: [updater]
            }, txBuilder.getTxCtx());

            txBuilder.addCmd(updateProposalCmd);
          }
        } else {
          txBuilder.addCmd(updateAccountCmd);
        }

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': teamId });
        return this.teamHttp.updateTeam(msg);
      });
  }

  getTeam(teamId) {
    return Promise.all([
      this.teamHttp.getTeam(teamId),
      this.usersService.getUsersByResearchGroup(teamId)
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
