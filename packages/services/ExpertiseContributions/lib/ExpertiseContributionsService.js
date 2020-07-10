import { Singleton } from '@deip/toolbox';
import { ExpertiseContributionsHttp } from './ExpertiseContributionsHttp';
import deipRpc from '@deip/rpc-client';

class ExpertiseContributionsService extends Singleton {
  expertiseContributionsHttp = ExpertiseContributionsHttp.getInstance();

  getEciHistoryByResearchContentAndDiscipline(researchContentId, disciplineId) {
    return deipRpc.api.getEciHistoryByResearchContentAndDisciplineAsync(researchContentId, disciplineId);
  }

  getEciHistoryByResearchAndDiscipline(researchId, disciplineId) {
    return deipRpc.api.getEciHistoryByResearchAndDisciplineAsync(researchId, disciplineId);
  }

  getExpertiseContributionsByResearch(researchId) {
    return deipRpc.api.getExpertiseContributionsByResearchAsync(researchId);
  }

  getExpertiseContributionsByResearchAndDiscipline(researchId, disciplineId) {
    return deipRpc.api.getExpertiseContributionsByResearchAndDisciplineAsync(researchId, disciplineId);
  }

  getExpertiseContributionByResearchContentAndDiscipline(researchContentId, disciplineId) {
    return deipRpc.api.getExpertiseContributionByResearchContentAndDisciplineAsync(researchContentId, disciplineId);
  }

  getExpertiseContributionsByResearchContent(researchContentId) {
    return deipRpc.api.getExpertiseContributionsByResearchContentAsync(researchContentId);
  }

  getAccountExpertiseStats(username, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {

    const filter = {
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
    };

    return this.expertiseContributionsHttp.getAccountExpertiseStats(username, filter);
  }


  getAccountExpertiseHistory(username, {
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {

    const filter = {
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
    };

    return this.expertiseContributionsHttp.getAccountExpertiseHistory(username, filter);
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
      searchTerm: searchTerm || "",
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
    };

    return this.expertiseContributionsHttp.getAccountsExpertiseStats(filter);
  }

  getDisciplineExpertiseHistory({
    discipline,
    from,
    to,
    contribution,
    criteria
  }) {

    const filter = {
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
    };

    return this.expertiseContributionsHttp.getDisciplineExpertiseHistory(filter);
  }

  getDisciplinesExpertiseStatsHistory({
    from,
    to,
    step
  }) {

    const filter = {
      from: from || "",
      to: to || "",
      step: step || ""
    };

    return this.expertiseContributionsHttp.getDisciplinesExpertiseStatsHistory(filter);
  }

  getDisciplinesExpertiseLastStats() {
    return this.expertiseContributionsHttp.getDisciplinesExpertiseLastStats();
  }

  getResearchContentsExpertiseHistory({
    discipline
  }) {

    const filter = {
      discipline
    };

    return this.expertiseContributionsHttp.getResearchContentsExpertiseHistory(filter);
  }
  
}

export {
  ExpertiseContributionsService
};
