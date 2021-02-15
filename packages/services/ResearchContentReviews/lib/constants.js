import { RESEARCH_TYPES } from '@deip/research-content-service';
import { createEnum } from '@deip/toolbox';

const ASSESSMENT_CRITERIA_TYPE = createEnum({
  UNKNOWN: 0,
  NOVELTY: 1,
  TECHNICAL_QUALITY: 2,
  METHODOLOGY: 3,
  IMPACT: 4,
  RATIONALITY: 5,
  REPLICATION: 6,
  COMMERCIALIZATION: 7
});

const assessmentCriterias = {
  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_ARTICLE].toLowerCase()]: [
    { id: ASSESSMENT_CRITERIA_TYPE.IMPACT, name: 'impact', title: 'Impact', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.NOVELTY, name: 'novelty', title: 'Novelty', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.COMMERCIALIZATION, name: 'commercialization', title: 'Commercialization', max: 5 }
  ],

  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_DATA].toLowerCase()]: [
    { id: ASSESSMENT_CRITERIA_TYPE.COMMERCIALIZATION, name: 'commercialization', title: 'Commercialization', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.TECHNICAL_QUALITY, name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.REPLICATION, name: 'replication', title: 'Replication', max: 5 }
  ],

  default: [
    { id: ASSESSMENT_CRITERIA_TYPE.NOVELTY, name: 'novelty', title: 'Novelty', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.TECHNICAL_QUALITY, name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { id: ASSESSMENT_CRITERIA_TYPE.COMMERCIALIZATION, name: 'commercialization', title: 'Commercialization', max: 5 }
  ]
};

export {
  assessmentCriterias,
  ASSESSMENT_CRITERIA_TYPE
};
