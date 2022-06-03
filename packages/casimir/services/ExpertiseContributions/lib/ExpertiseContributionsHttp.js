import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

export class ExpertiseContributionsHttp {
  http = HttpService.getInstance();

  async getAccountExpertiseHistory(username, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/history${query}`);
  }

  async getAccountExpertiseStats(username, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/user/${username}/stats${query}`);
  }

  async getAccountsExpertiseStats(filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[searchTerm]=${filter.searchTerm}&filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/users/stats${query}`);
  }

  async getProjectExpertiseHistory(projectId, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project/${projectId}/history${query}`);
  }

  async getProjectExpertiseStats(projectId, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project/${projectId}/stats${query}`);
  }

  async getProjectsExpertiseStats(filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project/stats${query}`);
  }

  async getProjectContentExpertiseHistory(projectContentId, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project-content/${projectContentId}/history${query}`);
  }

  async getProjectContentExpertiseStats(projectContentId, filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project-content/${projectContentId}/stats${query}`);
  }

  async getProjectContentsExpertiseStats(filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}&filter[from]=${filter.from}&filter[to]=${filter.to}`;
    return this.http.get(`/api/expertise/project-content/stats${query}`);
  }

  async getDomainExpertiseHistory(filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[domain]=${filter.domain}&filter[from]=${filter.from}&filter[to]=${filter.to}&filter[contribution]=${filter.contribution}&filter[criteria]=${filter.criteria}`;
    return this.http.get(`/api/expertise/domains/history${query}`);
  }

  async getDomainsExpertiseStatsHistory(filter) {
    // eslint-disable-next-line max-len
    const query = `?filter[from]=${filter.from}&filter[to]=${filter.to}&filter[step]=${filter.step}`;
    return this.http.get(`/api/expertise/domains/stats-history${query}`);
  }

  async getDomainsExpertiseLastStats() {
    return this.http.get('/api/expertise/domains/stats');
  }

  async getAccountExpertiseTokens(username) {
    return this.http.get(`/api/expertise/user/${username}/tokens`);
  }

  async getDomainExpertiseTokens(domainId) {
    return this.http.get(`/api/expertise/domain/${domainId}/tokens`);
  }

  async getEciHistoryByProjectContentAndDomain(contentId, domainId) {
    return this.http.get(`/api/expertise/content/${contentId}/domain/${domainId}/history`);
  }

  async getExpertiseContributionsByProject(projectId) {
    return this.http.get(`/api/expertise/project/${projectId}`);
  }

  async getExpertiseContributionsByProjectAndDomain(projectId, domainId) {
    return this.http.get(`/api/expertise/project/${projectId}/domain/${domainId}`);
  }

  async getExpertiseContributionByProjectContentAndDomain(contentId, domainId) {
    return this.http.get(`/api/expertise/content/${contentId}/domain/${domainId}`);
  }

  async getExpertiseContributionsByProjectContent(contentId) {
    return this.http.get(`/api/expertise/content/${contentId}`);
  }

  /** @type {() => ExpertiseContributionsHttp} */
  static getInstance = makeSingletonInstance(() => new ExpertiseContributionsHttp());
}
