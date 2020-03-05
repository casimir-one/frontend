import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  getInvestmentPortfolio(username) {
    return this.http.get(`/api/investment-portfolio/${username}`);
  }

  updateInvestmentPortfolio(username, updated) {
    return this.http.put(`/api/investment-portfolio/${username}`, updated);
  }
}

export {
  InvestmentsHttp
};
