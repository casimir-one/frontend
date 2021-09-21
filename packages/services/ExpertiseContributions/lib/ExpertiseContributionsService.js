import { Singleton } from '@deip/toolbox';
import { ExpertiseContributionsHttp } from './ExpertiseContributionsHttp';

class ExpertiseContributionsService extends Singleton {
  expertiseContributionsHttp = ExpertiseContributionsHttp.getInstance();

  getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.expertiseContributionsHttp
      .getEciHistoryByResearchContentAndDiscipline(contentId, disciplineId);
  }

  getExpertiseContributionsByResearch(researchId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByResearch(researchId);
  }

  getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId);
  }

  getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId) {
    return this.expertiseContributionsHttp
      .getExpertiseContributionByResearchContentAndDiscipline(contentId, disciplineId);
  }

  getExpertiseContributionsByResearchContent(contentId) {
    return this.expertiseContributionsHttp.getExpertiseContributionsByResearchContent(contentId);
  }

  getAccountExpertiseHistory(username, {
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

  getAccountExpertiseStats(username, {
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

  getAccountsExpertiseStats({
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

  getResearchExpertiseHistory(researchExternalId, {
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

  getResearchExpertiseStats(researchExternalId, {
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

  getResearchesExpertiseStats({
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

  getResearchContentExpertiseHistory(researchContentExternalId, {
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

  getResearchContentExpertiseStats(researchContentExternalId, {
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

  getResearchContentsExpertiseStats({
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

  getDisciplineExpertiseHistory({
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

  getDisciplinesExpertiseStatsHistory({
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

  getDisciplinesExpertiseLastStats() {
    return this.expertiseContributionsHttp.getDisciplinesExpertiseLastStats();
  }

  getAccountExpertiseTokens(username) {
    return this.expertiseContributionsHttp.getAccountExpertiseTokens(username);
  }

  getDisciplineExpertiseTokens(disciplineExternalId) {
    return this.expertiseContributionsHttp.getDisciplineExpertiseTokens(disciplineExternalId);
  }
}

export {
  ExpertiseContributionsService
};
