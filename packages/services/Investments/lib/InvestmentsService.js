import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { ApplicationJsonMessage } from '@deip/request-models';
import {
  APP_PROPOSAL,
  UpdateProposalCmd,
  ProtocolRegistry,
  CreateProposalCmd,
  CreateProjectTokenSaleCmd,
  ContributeProjectToTokenSaleCmd
} from '@deip/command-models';
import { InvestmentsHttp } from './InvestmentsHttp';
import { TS_TYPES } from './constants';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();

  proxydi = proxydi;

  deipRpc = deipRpc;

  getAccountRevenueHistoryByAsset(account, symbol, step = 0, cursor = 0, targetAsset = 'USD') {
    return this.investmentsHttp.getAccountRevenueHistoryByAsset(
      account,
      symbol,
      cursor,
      step,
      targetAsset
    );
  }

  getAccountRevenueHistory(account, cursor = 0) {
    return this.investmentsHttp.getAccountRevenueHistory(account, cursor);
  }

  getAssetRevenueHistory(symbol, cursor = 0) {
    return this.investmentsHttp.getAssetRevenueHistory(symbol, cursor);
  }

  getCurrentTokenSaleByProject(projectId) {
    return this.investmentsHttp.getProjectTokenSalesByProject(projectId)
      .then((tokenSales) => tokenSales.find(
        (ts) => ts.status === TS_TYPES.ACTIVE || ts.status === TS_TYPES.INACTIVE
      ));
  }

  createProjectTokenSale({ privKey, username }, {
    teamId,
    projectId,
    startTime,
    endTime,
    securityTokensOnSale,
    softCap,
    hardCap
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
        const сreateProjectTokenSaleCmd = new CreateProjectTokenSaleCmd({
          teamId,
          projectId,
          startTime,
          endTime,
          securityTokensOnSale,
          softCap,
          hardCap,
          creator: username
        }, txBuilder.getTxCtx());

        if (isProposal) {
          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_TOKEN_SALE_PROPOSAL,
            creator: username,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [сreateProjectTokenSaleCmd]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);

          if (isProposalApproved) {
            const updateProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: updateProposalId,
              activeApprovalsToAdd: [username]
            }, txBuilder.getTxCtx());

            txBuilder.addCmd(updateProposalCmd);
          }
        } else {
          txBuilder.addCmd(сreateProjectTokenSaleCmd);
        }

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new ApplicationJsonMessage({}, txEnvelop);
        return this.investmentsHttp.createProjectTokenSale(msg);
      });
  }

  contributeProjectTokenSale({ privKey }, {
    tokenSaleId,
    contributor,
    amount
  }) {
    const { PROTOCOL } = this.proxydi.get('env');
    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    return txBuilder.begin()
      .then(() => {
        const contributeProjectToTokenSaleCmd = new ContributeProjectToTokenSaleCmd({
          tokenSaleId,
          contributor,
          amount
        }, txBuilder.getTxCtx());

        txBuilder.addCmd(contributeProjectToTokenSaleCmd);
        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new ApplicationJsonMessage({}, txEnvelop);
        return this.investmentsHttp.contributeProjectTokenSale(msg);
      });
  }

  getProjectTokenSalesByProject(projectId) {
    return this.investmentsHttp.getProjectTokenSalesByProject(projectId);
  }

  getProjectTokenSaleContributions(projectTokenSaleId) {
    return this.investmentsHttp.getProjectTokenSaleContributions(projectTokenSaleId);
  }

  getProjectTokenSaleContributionsByProject(projectId) {
    return this.investmentsHttp.getProjectTokenSaleContributionsByProject(projectId);
  }

  getProjectTokenSale(tokenSaleId) {
    return this.investmentsHttp.getProjectTokenSale(tokenSaleId);
  }
}

export {
  InvestmentsService
};
