import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/message-models';
import { APP_PROPOSAL, TS_TYPES } from '@deip/constants';
import {
  UpdateProposalCmd,
  CreateProposalCmd,
  CreateInvestmentOpportunityCmd,
  InvestCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { InvestmentsHttp } from './InvestmentsHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();

  proxydi = proxydi;

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
    shares,
    softCap,
    hardCap,
    title,
    metadata
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
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createInvestmentOpportunityCmd = new CreateInvestmentOpportunityCmd({
              teamId,
              projectId,
              startTime,
              endTime,
              shares,
              softCap,
              hardCap,
              creator: username,
              title,
              metadata
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_TOKEN_SALE_PROPOSAL,
                creator: username,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [createInvestmentOpportunityCmd]
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
              txBuilder.addCmd(createInvestmentOpportunityCmd);
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

  investProjectTokenSale({ privKey }, {
    tokenSaleId,
    investor,
    amount
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const investCmd = new InvestCmd({
              tokenSaleId,
              investor,
              amount
            });
            txBuilder.addCmd(investCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.investmentsHttp.investProjectTokenSale(msg);
          });
      });
  }

  getProjectTokenSalesByProject(projectId) {
    return this.investmentsHttp.getProjectTokenSalesByProject(projectId);
  }

  getProjectTokenSaleInvestments(tokenSaleId) {
    return this.investmentsHttp.getProjectTokenSaleInvestments(tokenSaleId);
  }

  getProjectTokenSaleInvestmentsByProject(projectId) {
    return this.investmentsHttp.getProjectTokenSaleInvestmentsByProject(projectId);
  }

  getAccountInvestmentsHistory(account) {
    return this.investmentsHttp.getAccountInvestmentsHistory(account);
  }

  getInvestmentsHistoryByTokenSale(tokenSaleId) {
    return this.investmentsHttp.getInvestmentsHistoryByTokenSale(tokenSaleId);
  }

  getProjectTokenSale(tokenSaleId) {
    return this.investmentsHttp.getProjectTokenSale(tokenSaleId);
  }
}

export {
  InvestmentsService
};
