import deipRpc from '@deip/deip-oa-rpc-client';
import _ from 'lodash';
import { Singleton } from '@deip/toolbox';
import { AppConfigService } from '@deip/app-config-service';
import { TS_TYPES } from './constants';
import { InvestmentsHttp } from './InvestmentsHttp';

class InvestmentsService extends Singleton {
  investmentPortfolioHttp = InvestmentsHttp.getInstance();

  _deipRpcInstance;

  get deipRpc() {
    if (!this._deipRpcInstance) {
      const env = AppConfigService.getInstance().get('env');

      this._deipRpcInstance = deipRpc;

      this._deipRpcInstance.api.setOptions({
        url: env.DEIP_FULL_NODE_URL,
        reconnectTimeout: 3000
      });

      this._deipRpcInstance.config.set('chain_id', env.CHAIN_ID);
    }
    return this._deipRpcInstance;
  }

  getInvestmentPortfolio(username) {
    return this.investmentPortfolioHttp.getInvestmentPortfolio(username)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  updateInvestmentPortfolio(username, updated) {
    return this.investmentPortfolioHttp.updateInvestmentPortfolio(username, updated)
      .then((investmentPortfolio) => investmentPortfolio);
  }

  getCurrentTokenSaleByResearchId(researchId) {
    return this.deipRpc.api.getResearchTokenSalesByResearchIdAsync(researchId)
      .then((tokenSales) =>
        // only one active or inactive token sale is able to exist in research
        _.find(tokenSales, (tokenSale) => tokenSale.status === TS_TYPES.ACTIVE
          || tokenSale.status === TS_TYPES.INACTIVE));
  }
}

export {
  InvestmentsService
};
