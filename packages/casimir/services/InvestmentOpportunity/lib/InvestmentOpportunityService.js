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

/**
 * @typedef {{isProposal: boolean,
 *  isProposalApproved: boolean,
 *  proposalLifetime: number}} ProposalInfo
 */

/**
 * @typedef {{privKey: string, username: string}} Initiator
 */

/**
 * @typedef {{ id: string, symbol: string, amount: string, precision: number}} Asset
 */

/**
 * Investment opportunity data transport
 */
export class InvestmentOpportunityService {
  investmentOpportunityHttp = InvestmentOpportunityHttp.getInstance();

  proxydi = proxydi;

  /**
   * Get account revenue history by asset
   * @param {string} account
   * @param {string} symbol asset symbol
   * @param {number} [step=0]
   * @param {number} [cursor=0]
   * @param {string} [targetAsset=USD]
   * @returns {Promise<Object>}
   */
  async getAccountRevenueHistoryByAsset(account, symbol, step = 0, cursor = 0, targetAsset = 'USD') {
    return this.investmentOpportunityHttp.getAccountRevenueHistoryByAsset(
      account,
      symbol,
      cursor,
      step,
      targetAsset
    );
  }

  /**
   * Get account revenue history
   * @param {string} account
   * @param {number} [cursor=0]
   * @returns {Promise<Object>}
   */
  async getAccountRevenueHistory(account, cursor = 0) {
    return this.investmentOpportunityHttp.getAccountRevenueHistory(account, cursor);
  }

  /**
   * Get asset revenue history
   * @param {string} symbol
   * @param {number} [cursor=0]
   * @returns {Promise<Object>}
   */
  async getAssetRevenueHistory(symbol, cursor = 0) {
    return this.investmentOpportunityHttp.getAssetRevenueHistory(symbol, cursor);
  }

  /**
   * Get current investment opportunity for project
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
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

  /**
   * Create investment opportunity
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data.teamId
   * @param {string} payload.data.projectId
   * @param {number} payload.data.startTime
   * @param {number} payload.data.endTime
   * @param {Array.<Asset>} payload.data.shares
   * @param {Asset} payload.data.softCap
   * @param {Asset} payload.data.hardCap
   * @param {string} payload.data.title
   * @param {Object} payload.data.metadata
   * @param {ProposalInfo} payload.proposalInfo
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const {
      initiator: { privKey, username },
      data: {
        teamId,
        projectId,
        startTime,
        endTime,
        shares,
        softCap,
        hardCap,
        title,
        metadata
      },
      proposalInfo
    } = payload;

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
              const proposalBatch = [
                createInvestmentOpportunityCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.INVESTMENT_OPPORTUNITY_PROPOSAL,
                    creator: username,
                    expirationTime: proposalLifetime || proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });
                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const updateProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: updateProposalId,
                      account: username,
                      batchWeight: proposalBatchWeight
                    });
                    txBuilder.addCmd(updateProposalCmd);
                  }
                  return txBuilder.end();
                });
            } else {
              txBuilder.addCmd(createInvestmentOpportunityCmd);
              return txBuilder.end();
            }
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.investmentOpportunityHttp.create(msg);
          });
      });
  }

  /**
   * Invest to investment opportunity
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data.investmentOpportunityId
   * @param {string} payload.data.investor
   * @param {Asset} payload.data.asset
   * @returns {Promise<Object>}
   */
  async invest(payload) {
    const {
      initiator: { privKey },
      data: {
        investmentOpportunityId,
        investor,
        asset
      }
    } = payload;

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

  /**
   * Get investment opportunity
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.investmentOpportunityHttp.getOne(id);
  }

  /**
   * Get investment opportunities by project ids
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.investmentOpportunityHttp.getListByProject(projectId);
  }

  /**
   * Get investments by project
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getInvestmentsByProject(projectId) {
    return this.investmentOpportunityHttp.getInvestmentsByProject(projectId);
  }

  /**
   * Get investment opportunity history for account
   * @param {string} account
   * @returns {Promise<Object>}
   */
  async getAccountInvestmentOpportunityHistory(account) {
    return this.investmentOpportunityHttp.getAccountInvestmentOpportunityHistory(account);
  }

  /**
   * Get investment opportunity history
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getInvestmentOpportunityHistoryById(id) {
    return this.investmentOpportunityHttp
      .getInvestmentOpportunityHistoryById(id);
  }

  /** @type {() => InvestmentOpportunityService} */
  static getInstance = createInstanceGetter(InvestmentOpportunityService);
}
