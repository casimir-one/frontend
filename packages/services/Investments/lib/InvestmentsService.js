import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { TS_TYPES } from './constants';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { InvestmentsHttp } from './InvestmentsHttp';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 100).toISOString().split('.')[0]; // 100 years

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  getAccountRevenueHistoryByAsset(account, symbol, step = 0, cursor = 0, targetAsset = "USD") {
    return this.investmentsHttp.getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset);
  }

  getAccountRevenueHistory(account, cursor = 0) {
    return this.investmentsHttp.getAccountRevenueHistory(account, cursor);
  }

  getAssetRevenueHistory(symbol, cursor = 0) {
    return this.investmentsHttp.getAssetRevenueHistory(symbol, cursor);
  }

  getCurrentTokenSaleByResearch(researchId) {
    return this.investmentsHttp.getCurrentTokenSaleByResearch(researchId)
      .then((tokenSales) => tokenSales.find(ts => ts.status === TS_TYPES.ACTIVE || ts.status === TS_TYPES.INACTIVE))
  }

  createResearchTokenSale({ privKey, username }, isProposal, {
    researchGroup,
    researchExternalId,
    startTime,
    endTime,
    securityTokensOnSale,
    softCap,
    hardCap,
    extensions
  }) {

    const offchainMeta = {};

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [research_token_sale_external_id, create_research_token_sale_op] = deipRpc.operations.createEntityOperation(['create_research_token_sale', {
          research_group: researchGroup,
          research_external_id: researchExternalId,
          start_time: startTime,
          end_time: endTime,
          security_tokens_on_sale: securityTokensOnSale,
          soft_cap: softCap,
          hard_cap: hardCap,
          extensions: extensions
        }], refBlock);

        if (isProposal) {

          const proposal = {
            creator: username,
            proposedOps: [{ "op": create_research_token_sale_op }],
            expirationTime: proposalExpiration,
            reviewPeriodSeconds: undefined,
            extensions: []
          }

          return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
            .then(({ tx: signedProposalTx }) => {
              return this.investmentsHttp.createResearchTokenSale({ tx: signedProposalTx, offchainMeta, isProposal })
            })

        } else {

          return this.blockchainService.signOperations([create_research_token_sale_op], privKey, refBlock)
            .then((signedTx) => {
              return this.investmentsHttp.createResearchTokenSale({ tx: signedTx, offchainMeta, isProposal })
            });
        }

      });
  }

  contributeResearchTokenSale({ privKey, username }, {
    tokenSaleExternalId,
    contributor,
    amount,
    extensions
  }) {

    const contribute_to_token_sale_op = ['contribute_to_token_sale', {
      token_sale_external_id: tokenSaleExternalId,
      contributor: contributor,
      amount: amount,
      extensions: extensions
    }]

    return this.blockchainService.signOperations([contribute_to_token_sale_op], privKey)
      .then((signedTx) => {
        return this.investmentsHttp.contributeResearchTokenSale({ tx: signedTx })
      });
  }

  // deprecated
  getInvestmentPortfolio(username) {
    return this.investmentsHttp.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  // deprecated
  updateInvestmentPortfolio(username, updated) {
    return this.investmentsHttp.updateInvestmentPortfolio(username, updated)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  getResearchTokenSalesByResearch(researchExternalId) {
    return this.investmentsHttp.getResearchTokenSalesByResearch(researchExternalId)
  }

  getResearchTokenSaleContributions(researchTokenSaleExternalId) {
    return this.investmentsHttp.getResearchTokenSaleContributions(researchTokenSaleExternalId)
  }

  getResearchTokenSaleContributionsByResearch(researchExternalId) {
    return this.investmentsHttp.getResearchTokenSaleContributionsByResearch(researchExternalId)
  }

}

export {
  InvestmentsService
};
