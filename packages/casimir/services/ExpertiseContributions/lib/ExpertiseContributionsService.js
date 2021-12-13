import { createInstanceGetter } from '@deip/toolbox';
import { ExpertiseContributionsHttp } from './ExpertiseContributionsHttp';

export class ExpertiseContributionsService {
  expertiseContributionsHttp = ExpertiseContributionsHttp.getInstance();

  async getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.expertiseContributionsHttp
      .getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId);
  }

  async getExpertiseContributionsByResearch(researchId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByResearch(researchId);
  }

  async getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId);
  }

  async getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId);
  }

  async getExpertiseContributionsByResearchContent(contentId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByResearchContent(contentId);
  }

  async getAccountExpertiseHistory(username, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountExpertiseHistory(username, filter);
  }

  async getAccountExpertiseStats(username, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountExpertiseStats(username, filter);
  }

  async getAccountsExpertiseStats({
    searchTerm,
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      searchTerm: searchTerm || '',
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getAccountsExpertiseStats(filter);
  }

  async getResearchExpertiseHistory(researchExternalId, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getResearchExpertiseHistory(researchExternalId, filter);
  }

  async getResearchExpertiseStats(researchExternalId, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getResearchExpertiseStats(researchExternalId, filter);
  }

  async getResearchesExpertiseStats({
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getResearchesExpertiseStats(filter);
  }

  async getResearchContentExpertiseHistory(researchContentExternalId, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp
      .getResearchContentExpertiseHistory(researchContentExternalId, filter);
  }

  async getResearchContentExpertiseStats(researchContentExternalId, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp
      .getResearchContentExpertiseStats(researchContentExternalId, filter);
  }

  async getResearchContentsExpertiseStats({
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getResearchContentsExpertiseStats(filter);
  }

  async getDisciplineExpertiseHistory({
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {
    const filter = {
      discipline: discipline || '',
      from: from || '',
      to: to || '',
      contribution: contribution || '',
      criteria: criteria || ''
    };

    return this.expertiseContributionsHttp.getDisciplineExpertiseHistory(filter);
  }

  async getDisciplinesExpertiseStatsHistory({
    from,
    to,
    step
  }) {
    const filter = {
      from: from || '',
      to: to || '',
      step: step || ''
    };

    return this.expertiseContributionsHttp.getDisciplinesExpertiseStatsHistory(filter);
  }

  async getDisciplinesExpertiseLastStats() {
    return this.expertiseContributionsHttp.getDisciplinesExpertiseLastStats();
  }

  async getAccountExpertiseTokens(username) {
    return this.expertiseContributionsHttp.getAccountExpertiseTokens(username);
  }

  async getDisciplineExpertiseTokens(disciplineExternalId) {
    return this.expertiseContributionsHttp.getDisciplineExpertiseTokens(disciplineExternalId);
  }

  /** @type {() => ExpertiseContributionsService} */
  static getInstance = createInstanceGetter(ExpertiseContributionsService);
}
