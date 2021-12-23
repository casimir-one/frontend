import { createInstanceGetter } from '@deip/toolbox';
import { ExpertiseContributionsHttp } from './ExpertiseContributionsHttp';

export class ExpertiseContributionsService {
  expertiseContributionsHttp = ExpertiseContributionsHttp.getInstance();

  async getEciHistoryByProjectContentAndDomain(contentId, domainId) {
    return this.expertiseContributionsHttp
      .getEciHistoryByProjectContentAndDomain(contentId, domainId);
  }

  async getExpertiseContributionsByProject(projectId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByProject(projectId);
  }

  async getExpertiseContributionsByProjectAndDomain(projectId, domainId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionsByProjectAndDomain(projectId, domainId);
  }

  async getExpertiseContributionByProjectContentAndDomain(contentId, domainId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionByProjectContentAndDomain(contentId, domainId);
  }

  async getExpertiseContributionsByProjectContent(contentId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByProjectContent(contentId);
  }

  async getAccountExpertiseHistory(username, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountExpertiseHistory(username, filter);
  }

  async getAccountExpertiseStats(username, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountExpertiseStats(username, filter);
  }

  async getAccountsExpertiseStats({
    searchTerm,
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      searchTerm: searchTerm || '',
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountsExpertiseStats(filter);
  }

  async getProjectExpertiseHistory(projectId, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getProjectExpertiseHistory(projectId, filter);
  }

  async getProjectExpertiseStats(projectId, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getProjectExpertiseStats(projectId, filter);
  }

  async getProjectsExpertiseStats({
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getProjectsExpertiseStats(filter);
  }

  async getProjectContentExpertiseHistory(projectContentId, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp
      .getProjectContentExpertiseHistory(projectContentId, filter);
  }

  async getProjectContentExpertiseStats(projectContentId, {
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp
      .getProjectContentExpertiseStats(projectContentId, filter);
  }

  async getProjectContentsExpertiseStats({
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getProjectContentsExpertiseStats(filter);
  }

  async getDomainExpertiseHistory({
    domain,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      domain: domain || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getDomainExpertiseHistory(filter);
  }

  async getDomainsExpertiseStatsHistory({
    from,
    to,
    step
  }) {
    const filter = {
      from: from || '',
      to: to || '',
      step: step || ''
    };

    return this.expertiseContributionsHttp.getDomainsExpertiseStatsHistory(filter);
  }

  async getDomainsExpertiseLastStats() {
    return this.expertiseContributionsHttp.getDomainsExpertiseLastStats();
  }

  async getAccountExpertiseTokens(username) {
    return this.expertiseContributionsHttp.getAccountExpertiseTokens(username);
  }

  async getDomainExpertiseTokens(domainId) {
    return this.expertiseContributionsHttp.getDomainExpertiseTokens(domainId);
  }

  /** @type {() => ExpertiseContributionsService} */
  static getInstance = createInstanceGetter(ExpertiseContributionsService);
}
