import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ExpertiseContributionsHttp extends Singleton {
  http = HttpService.getInstance();

  getAccountExpertiseStats(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/stats${query}`);
  }

  getAccountExpertiseHistory(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/history${query}`);
  }

  getAccountsExpertiseStats(filter) {
    const query = `?filter[searchTerm]=${filter.searchTerm}&filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/users/stats${query}`);
  }

  getDisciplinesExpertiseStatsHistory() {
    return this.http.get(`/api/expertise/disciplines/stats-history`);
  }

  getDisciplinesExpertiseStats() {
    return this.http.get(`/api/expertise/disciplines/stats`);
  }

  getResearchContentsExpertiseHistory(filter) {
    const query = `?filter[discipline]=${filter.discipline}`;
    return this.http.get(`/api/expertise/research-content/history${query}`);
  }

}

export {
  ExpertiseContributionsHttp
};
