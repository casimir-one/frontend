import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/message-models';
import {
  APP_PROPOSAL,
  UpdateProposalCmd,
  CreateProposalCmd,
  CreateProjectTokenSaleCmd,
  ContributeProjectToTokenSaleCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { InvestmentsHttp } from './InvestmentsHttp';
import { TS_TYPES } from './constants';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();

  proxydi = proxydi;

  deipRpc = deipRpc; // deprecated

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

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
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
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_TOKEN_SALE_PROPOSAL,
                creator: username,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [сreateProjectTokenSaleCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const updateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: updateProposalId,
                  activeApprovalsToAdd: [username]
                });

                txBuilder.addCmd(updateProposalCmd);
              }
            } else {
              txBuilder.addCmd(сreateProjectTokenSaleCmd);
            }
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.investmentsHttp.createProjectTokenSale(msg);
          });
      });
  }

  contributeProjectTokenSale({ privKey }, {
    tokenSaleId,
    contributor,
    amount
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder.begin()
          .then(() => {
            const contributeProjectToTokenSaleCmd = new ContributeProjectToTokenSaleCmd({
              tokenSaleId,
              contributor,
              amount
            });

            txBuilder.addCmd(contributeProjectToTokenSaleCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.investmentsHttp.contributeProjectTokenSale(msg);
          });
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

  getAccountContributionsHistory(account) {
    return this.investmentsHttp.getAccountContributionsHistory(account);
  }

  getProjectTokenSale(tokenSaleId) {
    return this.investmentsHttp.getProjectTokenSale(tokenSaleId);
  }
}

export {
  InvestmentsService
};
