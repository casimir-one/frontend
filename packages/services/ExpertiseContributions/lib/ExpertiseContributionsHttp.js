import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ExpertiseContributionsHttp {
  http = HttpService.getInstance();

  async getAccountExpertiseHistory(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/history${query}`);
  }

  async getAccountExpertiseStats(username, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/stats${query}`);
  }

  async getAccountsExpertiseStats(filter) {
    const query = `?filter[searchTerm]=${filter.searchTerm}&filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/users/stats${query}`);
  }

  async getResearchExpertiseHistory(researchExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/${researchExternalId}/history${query}`);
  }

  async getResearchExpertiseStats(researchExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/${researchExternalId}/stats${query}`);
  }

  async getResearchesExpertiseStats(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research/stats${query}`);
  }

  async getResearchContentExpertiseHistory(researchContentExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/${researchContentExternalId}/history${query}`);
  }

  async getResearchContentExpertiseStats(researchContentExternalId, filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/${researchContentExternalId}/stats${query}`);
  }

  async getResearchContentsExpertiseStats(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/research-content/stats${query}`);
  }

  async getDisciplineExpertiseHistory(filter) {
    const query = `?filter[discipline]=${filter.discipline}&filter[from]=${filter.from}&filter[to]=${filter.to}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}`;
    return this.http.get(`/api/expertise/disciplines/history${query}`);
  }

  async getDisciplinesExpertiseStatsHistory(filter) {
    const query = `?filter[from]=${filter.from}&filter[to]=${filter.to}&filter[step]=${filter.step}`;
    return this.http.get(`/api/expertise/disciplines/stats-history${query}`);
  }

  async getDisciplinesExpertiseLastStats() {
    return this.http.get('/api/expertise/disciplines/stats');
  }

  async getAccountExpertiseTokens(username) {
    return this.http.get(`/api/expertise/user/${username}/tokens`);
  }

  async getDisciplineExpertiseTokens(disciplineExternalId) {
    return this.http.get(`/api/expertise/discipline/${disciplineExternalId}/tokens`);
  }

  async getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.http.get(`/api/expertise/content/${contentId}/discipline/${disciplineId}/history`);
  }

  async getExpertiseContributionsByResearch(researchId) {
    return this.http.get(`/api/expertise/research/${researchId}`);
  }

  async getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId) {
    return this.http.get(`/api/expertise/research/${researchId}/discipline/${disciplineId}`);
  }

  async getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.http.get(`/api/expertise/content/${contentId}/discipline/${disciplineId}`);
  }

  async getExpertiseContributionsByResearchContent(contentId) {
    return this.http.get(`/api/expertise/content/${contentId}`);
  }

  /** @type {() => ExpertiseContributionsHttp} */
  static getInstance = createInstanceGetter(ExpertiseContributionsHttp);
}
