import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { TS_TYPES } from './constants';
import { BlockchainService } from '@deip/blockchain-service';
import { InvestmentsHttp } from './InvestmentsHttp';

class InvestmentsService extends Singleton {
  investmentsHttp = InvestmentsHttp.getInstance();
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
    amount,
    memo
  }) {

    const transfer_security_token_op = ['transfer_security_token', {
      from: sender,
      to: receiver,
      security_token_external_id: securityTokenExternalId,
      amount: amount,
      memo: memo,
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

  createResearchTokenSaleViaOffchain({ privKey, username }, isProposal, {
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
            creator: researchGroup,
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

  contributeToResearchTokenSaleViaOffchain({ privKey, username }, {
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
