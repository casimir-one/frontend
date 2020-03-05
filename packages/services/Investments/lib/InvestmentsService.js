import deipRpc from '@deip/deip-oa-rpc-client';
import _ from 'lodash';
import { Singleton } from '@deip/toolbox';
import { TS_TYPES } from './constants';
import { InvestmentsHttp } from './InvestmentsHttp';

class InvestmentsService extends Singleton {
  investmentPortfolioHttp = InvestmentsHttp.getInstance();

  getInvestmentPortfolio(username) {
    return this.investmentPortfolioHttp.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  updateInvestmentPortfolio(username, updated) {
    return this.investmentPortfolioHttp.updateInvestmentPortfolio(username, updated)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  getCurrentTokenSaleByResearchId(researchId) {
    return deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
      .then((tokenSales) =>
        // only one active or inactive token sale is able to exist in research
        _.find(tokenSales, (tokenSale) => tokenSale.status === TS_TYPES.ACTIVE
          || tokenSale.status === TS_TYPES.INACTIVE));
  }
}

export {
  InvestmentsService
};
