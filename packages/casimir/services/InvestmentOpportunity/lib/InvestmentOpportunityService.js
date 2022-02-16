import { proxydi } from '@deip/proxydi';
import { JsonDataMsg } from '@deip/messages';
import { APP_PROPOSAL, INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
import {
  AcceptProposalCmd,
  CreateProposalCmd,
  CreateInvestmentOpportunityCmd,
  InvestCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { createInstanceGetter } from '@deip/toolbox';
import { InvestmentOpportunityHttp } from './InvestmentOpportunityHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class InvestmentOpportunityService {
  investmentOpportunityHttp = InvestmentOpportunityHttp.getInstance();

  proxydi = proxydi;

  async getAccountRevenueHistoryByAsset(account, symbol, step = 0, cursor = 0, targetAsset = 'USD') {
    return this.investmentOpportunityHttp.getAccountRevenueHistoryByAsset(
      account,
      symbol,
      cursor,
      step,
      targetAsset
    );
  }

  async getAccountRevenueHistory(account, cursor = 0) {
    return this.investmentOpportunityHttp.getAccountRevenueHistory(account, cursor);
  }

  async getAssetRevenueHistory(symbol, cursor = 0) {
    return this.investmentOpportunityHttp.getAssetRevenueHistory(symbol, cursor);
  }

  async getCurrentInvestmentOpportunityByProject(projectId) {
    const res = await this.investmentOpportunityHttp.getListByProject(projectId);
    return {
      ...res,
      data: {
        items: res.data.items.find(
          (ts) => ts.status === INVESTMENT_OPPORTUNITY_STATUS.ACTIVE
          || ts.status === INVESTMENT_OPPORTUNITY_STATUS.INACTIVE
        )
      }
    };
  }

  async create({ privKey, username }, {
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
                type: APP_PROPOSAL.INVESTMENT_OPPORTUNITY_PROPOSAL,
                creator: username,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [createInvestmentOpportunityCmd]
              });
              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const updateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: updateProposalId,
                  account: username
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
            return this.investmentOpportunityHttp.create(msg);
          });
      });
  }

  async invest({ privKey }, {
    investmentOpportunityId,
    investor,
    asset
  }) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const investCmd = new InvestCmd({
              investmentOpportunityId,
              investor,
              asset
            });
            txBuilder.addCmd(investCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.investmentOpportunityHttp.invest(msg);
          });
      });
  }

  async getOne(id) {
    return this.investmentOpportunityHttp.getOne(id);
  }

  async getListByProject(projectId) {
    return this.investmentOpportunityHttp.getListByProject(projectId);
  }

  async getInvestmentsByProject(projectId) {
    return this.investmentOpportunityHttp.getInvestmentsByProject(projectId);
  }

  async getAccountInvestmentOpportunityHistory(account) {
    return this.investmentOpportunityHttp.getAccountInvestmentOpportunityHistory(account);
  }

  async getInvestmentOpportunityHistoryById(investmentOpportunityId) {
    return this.investmentOpportunityHttp
      .getInvestmentOpportunityHistoryById(investmentOpportunityId);
  }

  /** @type {() => InvestmentOpportunityService} */
  static getInstance = createInstanceGetter(InvestmentOpportunityService);
}
