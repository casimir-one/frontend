import { RESEARCH_TYPES } from '@deip/research-service';

const criterias = {
  novelty: 1,
  technical_quality: 2,
  methodology: 3,
  impact: 4,
  rationality: 5,
  replication: 6
}

const assessmentCriterias = {
  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_ARTICLE].toLowerCase()]: [
    { id: criterias.impact, name: 'impact', title: 'Impact', max: 5 },
    { id: criterias.novelty, name: 'novelty', title: 'Novelty', max: 5 },
    { id: criterias.methodology, name: 'methodology', title: 'Methodology', max: 5 }
  ],

  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_DATA].toLowerCase()]: [
    { id: criterias.rationality, name: 'rationality', title: 'Rationality', max: 5 },
    { id: criterias.technical_quality, name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { id: criterias.replication, name: 'replication', title: 'Replication', max: 5 }
  ],

  default: [
    { id: criterias.novelty, name: 'novelty', title: 'Novelty', max: 5 },
    { id: criterias.technical_quality, name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { id: criterias.methodology, name: 'methodology', title: 'Methodology', max: 5 }
  ]
};

export {
  assessmentCriterias
};
