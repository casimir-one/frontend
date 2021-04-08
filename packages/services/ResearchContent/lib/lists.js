import { RESEARCH_CONTENT_TYPES } from './constants';

let contentTypesMap = {
  [RESEARCH_CONTENT_TYPES.ANNOUNCEMENT]: { text: 'Announcement', order: 1 },
  // [RESEARCH_CONTENT_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_ARTICLE]: { text: 'Article', order: 2 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_BOOK]: { text: 'Book', order: 3 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CHAPTER]: { text: 'Chapter', order: 4 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CODE]: { text: 'Code', order: 5 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CONFERENCE_PAPER]: { text: 'Conference paper', order: 6 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_COVER_PAGE]: { text: 'Cover page', order: 7 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_DATA]: { text: 'Data', order: 8 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { text: 'Experiment findings', order: 9 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_METHOD]: { text: 'Method', order: 10 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_NEGATIVE_RESULTS]: { text: 'Negative results', order: 11 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PATENT]: { text: 'Patent', order: 12 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_POSTER]: { text: 'Poster', order: 13 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PREPRINT]: { text: 'Preprint', order: 14 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PRESENTATION]: { text: 'Presentation', order: 15 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_RAW_DATA]: { text: 'Raw data', order: 16 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_RESEARCH_PROPOSAL]: { text: 'Research proposal', order: 17 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_TECHNICAL_REPORT]: { text: 'Technical report', order: 18 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_THESIS]: { text: 'Thesis', order: 19 }
};

contentTypesMap = Object.keys(contentTypesMap).reduce((obj, key) => {
  obj[key] = {
    id: key,
    type: RESEARCH_CONTENT_TYPES[key].toLowerCase(),
    ...contentTypesMap[key]
  };
  return obj;
}, {});

const researchContentTypes = [...Object.values(contentTypesMap)].sort((a, b) => a.order - b.order);

export {
  researchContentTypes
};
