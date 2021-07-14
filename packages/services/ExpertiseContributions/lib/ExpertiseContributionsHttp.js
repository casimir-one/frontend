import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ExpertiseContributionsHttp extends Singleton {
  http = HttpService.getInstance();

  getAccountExpertiseHistory(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/history${query}`);
  }

  getAccountExpertiseStats(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/stats${query}`);
  }

  getAccountsExpertiseStats(filter) {
    const query = `?filter[searchTerm]=${filter.searchTerm}&filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/users/stats${query}`);
  }

  getResearchExpertiseHistory(researchExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/${researchExternalId}/history${query}`);
  }

  getResearchExpertiseStats(researchExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/${researchExternalId}/stats${query}`);
  }

  getResearchesExpertiseStats(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/stats${query}`);
  }

  getResearchContentExpertiseHistory(researchContentExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/${researchContentExternalId}/history${query}`);
  }

  getResearchContentExpertiseStats(researchContentExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/${researchContentExternalId}/stats${query}`);
  }

  getResearchContentsExpertiseStats(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/stats${query}`);
  }

  getDisciplineExpertiseHistory(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[from]=${filter.from}&filter[to]=${filter.to}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}`;
    return this.http.get(`/api/expertise/disciplines/history${query}`);
  }

  getDisciplinesExpertiseStatsHistory(filter) {
    const query = `?filter[from]=${filter.from}&filter[to]=${filter.to}&filter[step]=${filter.step}`;
    return this.http.get(`/api/expertise/disciplines/stats-history${query}`);
  }

  getDisciplinesExpertiseLastStats() {
    return this.http.get('/api/expertise/disciplines/stats');
  }

  getAccountExpertiseTokens(username) {
    return this.http.get(`/api/expertise/user/${username}/tokens`);
  }

  getDisciplineExpertiseTokens(disciplineExternalId) {
    return this.http.get(`/api/expertise/discipline/${disciplineExternalId}/tokens`);
  }

  getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.http.get(`/api/expertise/content/${contentId}/discipline/${disciplineId}/history`);
  }

  getExpertiseContributionsByResearch(researchId) {
    return this.http.get(`/api/expertise/research/${researchId}`);
  }

  getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId) {
    return this.http.get(`/api/expertise/research/${researchId}/discipline/${disciplineId}`);
  }

  getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.http.get(`/api/expertise/content/${contentId}/discipline/${disciplineId}`);
  }

  getExpertiseContributionsByResearchContent(contentId) {
    return this.http.get(`/api/expertise/content/${contentId}`);
  }
}

export {
  ExpertiseContributionsHttp
};
