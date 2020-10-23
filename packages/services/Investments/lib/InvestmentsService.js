import deipRpc from '@deip/rpc-client';
import _ from 'lodash';
import { Singleton } from '@deip/toolbox';
import { TS_TYPES } from './constants';
import { BlockchainService } from '@deip/blockchain-service';
import { InvestmentsHttp } from './InvestmentsHttp';

class InvestmentsService extends Singleton {
  investmentPortfolioHttp = InvestmentsHttp.getInstance();
  blockchainService = BlockchainService.getInstance();

  createSecurityToken({ privKey, username }, {
    researchExternalId,
    researchGroup,
    amount
  }) {
    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [security_token_external_id, create_security_token_op] = deipRpc.operations.createEntityOperation(['create_security_token', {
          research_external_id: researchExternalId,
          research_group: researchGroup,
          amount: amount,
          options: ['basic_tokenization', {}],
          extensions: []
        }], refBlock);

        return this.blockchainService.signOperations([create_security_token_op], privKey, refBlock)
          .then((signedTx) => {
            return this.blockchainService.sendTransactionAsync(signedTx)
          });
      });
  }

  transferSecurityToken({ privKey, username }, {
    sender,
    receiver,
    securityTokenExternalId,
    amount
  }) {

    const transfer_security_token_op = ['transfer_security_token', {
      from: sender,
      to: receiver,
      security_token_external_id: securityTokenExternalId,
      amount: amount,
      extensions: []
    }];

    return this.blockchainService.signOperations([transfer_security_token_op], privKey)
      .then((signedTx) => {
        return this.blockchainService.sendTransactionAsync(signedTx)
      });
  }

  getSecurityToken(securityTokenExternalId) {
    return deipRpc.api.getSecurityTokenAsync(securityTokenExternalId);
  }

  getSecurityTokensByResearch(researchExternalId) {
    return deipRpc.api.getSecurityTokensByResearchAsync(researchExternalId);
  }

  getSecurityTokenBalance(owner, securityTokenExternalId) {
    return deipRpc.api.getSecurityTokenBalanceAsync(owner, securityTokenExternalId);
  }

  getSecurityTokenBalances(securityTokenExternalId) {
    return deipRpc.api.getSecurityTokenBalancesAsync(securityTokenExternalId);
  }

  getSecurityTokenBalancesByOwner(owner) {
    return deipRpc.api.getSecurityTokenBalancesByOwnerAsync(owner);
  }

  getSecurityTokenBalancesByResearch(researchExternalId) {
    return deipRpc.api.getSecurityTokenBalancesByResearchAsync(researchExternalId);
  }

  getSecurityTokenBalancesByOwnerAndResearch(owner, researchExternalId) {
    return deipRpc.api.getSecurityTokenBalancesByOwnerAndResearchAsync(owner, researchExternalId);
  }

  getAccountRevenueHistoryBySecurityToken(account, securityTokenExternalId, step = 0, cursor = 0) {
    return deipRpc.api.getAccountRevenueHistoryBySecurityTokenAsync(account, securityTokenExternalId, cursor, step);
  }

  getAccountRevenueHistory(account, cursor = 0) {
    return deipRpc.api.getAccountRevenueHistoryAsync(account, cursor);
  }

  getSecurityTokenRevenueHistory(securityTokenExternalId, cursor = 0) {
    return deipRpc.api.getSecurityTokenRevenueHistoryAsync(securityTokenExternalId, cursor);
  }

  getCurrentTokenSaleByResearchId(researchId) {
    return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
      .then((tokenSales) =>
        // only one active or inactive token sale can exist in research
        _.find(tokenSales, (tokenSale) => tokenSale.status === TS_TYPES.ACTIVE
          || tokenSale.status === TS_TYPES.INACTIVE));
  }

  // deprecated
  getInvestmentPortfolio(username) {
    return this.investmentPortfolioHttp.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  // deprecated
  updateInvestmentPortfolio(username, updated) {
    return this.investmentPortfolioHttp.updateInvestmentPortfolio(username, updated)
      .then((investmentPortfolio) => investmentPortfolio);
  }

}

export {
  InvestmentsService
};
