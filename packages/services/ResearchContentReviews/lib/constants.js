import { RESEARCH_TYPES } from '@deip/research-service';

const assessmentCriterias = {
  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_ARTICLE].toLowerCase()]: [
    { name: 'impact', title: 'Impact', max: 5 },
    { name: 'novelty', title: 'Novelty', max: 5 },
    { name: 'methodology', title: 'Methodology', max: 5 }
  ],

  [RESEARCH_TYPES[RESEARCH_TYPES.MILESTONE_DATA].toLowerCase()]: [
    { name: 'rationality', title: 'Rationality', max: 5 },
    { name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { name: 'replication', title: 'Replication', max: 5 }
  ],

  default: [
    { name: 'novelty', title: 'Novelty', max: 5 },
    { name: 'technical_quality', title: 'Technical Quality', max: 5 },
    { name: 'methodology', title: 'Methodology', max: 5 }
  ]
};

export {
  assessmentCriterias
};
