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

  getEciHistoryByAccountAndDiscipline(account, disciplineId) {
    return deipRpc.api.getEciHistoryByAccountAndDisciplineAsync(account, disciplineId);
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

  getAccountsExpertiseStats({
    name,
    discipline,
    contribution,
    criteria
  }) {

    const filter = {
      name,
      discipline,
      contribution,
      criteria
    };

    return this.expertiseContributionsHttp.getAccountsExpertiseStats(filter);
  }
}

export {
  ExpertiseContributionsService
};
