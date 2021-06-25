import crypto from '@deip/lib-crypto';
import {
  createFormData,
  isArray,
  isObject,
  replaceFileWithName,
  Singleton
} from '@deip/toolbox';

import { UserService } from '@deip/user-service';
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

const createHash = (val) => {
  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(string).buffer));
};

class TeamService extends Singleton {
  proxydi = proxydi;

  teamHttp = TeamHttp.getInstance();

  userService = UserService.getInstance();

  createTxBuilder() {
    const { PROTOCOL } = this.proxydi.get('env');
    const protocolRegistry = new ProtocolRegistry(PROTOCOL);

    return protocolRegistry.getTransactionsBuilder();
  }

  createTeam(payload) {
    const txBuilder = this.createTxBuilder();

    const { TENANT } = this.proxydi.get('env');
    const { IS_TESTNET } = this.proxydi.get('env');

    const {
      initiator: {
        memoKey,
        privKey,
        username: creator
      }
    } = payload;

    const authority = {
      auths: [{ name: TENANT, weight: 1 }, { name: creator, weight: 1 }],
      weight: 1
    };

    const formData = createFormData(payload);

    const attributes = replaceFileWithName(payload.attributes);
    const description = createHash(attributes);

    let entityId;

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
        }, txBuilder.getTxCtx());

        txBuilder.addCmd(createAccountCmd);

        entityId = createAccountCmd.getProtocolEntityId();

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': entityId });
        return this.teamHttp.createTeam(msg);
      });
  }

  updateTeam(payload) {
    const txBuilder = this.createTxBuilder();

    const {
      entityId,

      initiator: {
        privKey,
        username: creator
      },

      proposalInfo: {
        isProposal = false,
        isProposalApproved = true,
        proposalLifetime = proposalDefaultLifetime
      } = {},

      ownerAuth, // need clarification
      activeAuth // need clarification
    } = payload;

    const formData = createFormData(payload);

    const attributes = replaceFileWithName(payload.attributes);
    const description = createHash(attributes);

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
        }, txBuilder.getTxCtx());

        if (isProposal) {
          const createProposalCmd = new CreateProposalCmd({
            creator,
            type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
            expirationTime: proposalLifetime,
            proposedCmds: [updateAccountCmd]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);

          if (isProposalApproved) {
            const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: teamUpdateProposalId,
              activeApprovalsToAdd: [creator]
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
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': entityId });
        return this.teamHttp.updateTeam(msg);
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
