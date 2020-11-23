import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { TS_TYPES } from './constants';
import { BlockchainService } from '@deip/blockchain-service';
import { ProposalsService } from '@deip/proposals-service';
import { InvestmentsHttp } from './InvestmentsHttp';

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();
  blockchainService = BlockchainService.getInstance();
  proposalsService = ProposalsService.getInstance();

  createSecurityToken({ privKey, username }, {
    researchExternalId,
    researchGroup,
    symbol,
    precision,
    description,
    maxSupply,
    amount
  }) {

    const create_security_token_op = ['create_asset', {
      issuer: researchGroup,
      symbol: symbol,
      precision: precision,
      description: description,
      max_supply: maxSupply,
      traits: ['research_security_token', {
        research_external_id: researchExternalId,
        research_group: researchGroup,
        extensions: []
      }],
      extensions: []
    }];

    const issue_security_token_op = ['issue_asset', {
      issuer: researchGroup,
      amount: amount,
      recipient: researchGroup,
      memo: undefined,
      extensions: []
    }];

    return this.blockchainService.signOperations([create_security_token_op, issue_security_token_op], privKey)
      .then((signedTx) => {
        return this.blockchainService.sendTransactionAsync(signedTx)
      });
  }

  getAccountRevenueHistoryByAsset(account, symbol, step = 0, cursor = 0, targetAsset = "USD") {
    return deipRpc.api.getAccountRevenueHistoryBySecurityTokenAsync(account, symbol, cursor, step, targetAsset);
  }

  getAccountRevenueHistory(account, cursor = 0) {
    return deipRpc.api.getAccountRevenueHistoryAsync(account, cursor);
  }

  getAssetRevenueHistory(symbol, cursor = 0) {
    return deipRpc.api.getSecurityTokenRevenueHistoryAsync(symbol, cursor);
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
    const expirationTime = new Date(new Date().getTime() + 86400000 * 14).toISOString().split('.')[0]; // 14 days

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
            expirationTime: expirationTime,
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


  getCurrentTokenSaleByResearch(researchExternalId) {
    return deipRpc.api.getResearchTokenSalesByResearchAsync(researchExternalId)
      .then((tokenSales) => tokenSales.find(ts => ts.status === TS_TYPES.ACTIVE || ts.status === TS_TYPES.INACTIVE))
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

}

export {
  InvestmentsService
};
