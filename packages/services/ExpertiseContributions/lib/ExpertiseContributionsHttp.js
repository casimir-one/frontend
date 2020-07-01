import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ExpertiseContributionsHttp extends Singleton {
  http = HttpService.getInstance();

  getAccountsExpertiseStats(filter) {
    const query = `?filter[name]=${filter.name}&filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}`;
    return this.http.get(`/api/expertise/users/stats${query}`);
  }

  getDisciplinesExpertiseStatsHistory() {
    return this.http.get(`/api/expertise/disciplines/stats-history`);
  }

  getDisciplinesExpertiseStats() {
    return this.http.get(`/api/expertise/disciplines/stats`);
  }

  getResearchContentsExpertiseHistory() {
    return this.http.get(`/api/expertise/research-content/history`);
  }

}

export {
  ExpertiseContributionsHttp
};
