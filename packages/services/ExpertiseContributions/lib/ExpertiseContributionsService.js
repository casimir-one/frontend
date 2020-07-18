import { Singleton } from '@deip/toolbox';
import { ExpertiseContributionsHttp } from './ExpertiseContributionsHttp';
import deipRpc from '@deip/rpc-client';

class ExpertiseContributionsService extends Singleton {
  expertiseContributionsHttp = ExpertiseContributionsHttp.getInstance();

  getEciHistoryByResearchContentAndDiscipline(researchContentId, disciplineId) {
    return deipRpc.api.getEciHistoryByResearchContentAndDisciplineAsync(researchContentId, disciplineId);
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

  getResearchExpertiseHistory(researchExternalId, { 
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
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
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
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
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
      discipline: discipline || "",
      from: from || "",
      to: to || "",
      contribution: contribution || "",
      criteria: criteria || ""
    };

    return this.expertiseContributionsHttp.getResearchContentExpertiseHistory(researchContentExternalId, filter);
  }


  getResearchContentExpertiseStats(researchContentExternalId, {
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

    return this.expertiseContributionsHttp.getResearchContentExpertiseStats(researchContentExternalId, filter);
  }


  getResearchContentsExpertiseStats({
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
  
}

export {
  ExpertiseContributionsService
};
