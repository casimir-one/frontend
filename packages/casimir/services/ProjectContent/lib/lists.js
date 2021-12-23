import { PROJECT_CONTENT_TYPES } from '@deip/constants';

let contentTypesMap = {
  [PROJECT_CONTENT_TYPES.ANNOUNCEMENT]: { text: 'Announcement', order: 1 },
  // [PROJECT_CONTENT_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [PROJECT_CONTENT_TYPES.MILESTONE_ARTICLE]: { text: 'Article', order: 2 },
  [PROJECT_CONTENT_TYPES.MILESTONE_BOOK]: { text: 'Book', order: 3 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CHAPTER]: { text: 'Chapter', order: 4 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CODE]: { text: 'Code', order: 5 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CONFERENCE_PAPER]: { text: 'Conference paper', order: 6 },
  [PROJECT_CONTENT_TYPES.MILESTONE_COVER_PAGE]: { text: 'Cover page', order: 7 },
  [PROJECT_CONTENT_TYPES.MILESTONE_DATA]: { text: 'Data', order: 8 },
  [PROJECT_CONTENT_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { text: 'Experiment findings', order: 9 },
  [PROJECT_CONTENT_TYPES.MILESTONE_METHOD]: { text: 'Method', order: 10 },
  [PROJECT_CONTENT_TYPES.MILESTONE_NEGATIVE_RESULTS]: { text: 'Negative results', order: 11 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PATENT]: { text: 'Patent', order: 12 },
  [PROJECT_CONTENT_TYPES.MILESTONE_POSTER]: { text: 'Poster', order: 13 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PREPRINT]: { text: 'Preprint', order: 14 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PRESENTATION]: { text: 'Presentation', order: 15 },
  [PROJECT_CONTENT_TYPES.MILESTONE_RAW_DATA]: { text: 'Raw data', order: 16 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PROJECT_PROPOSAL]: { text: 'Project proposal', order: 17 },
  [PROJECT_CONTENT_TYPES.MILESTONE_TECHNICAL_REPORT]: { text: 'Technical report', order: 18 },
  [PROJECT_CONTENT_TYPES.MILESTONE_THESIS]: { text: 'Thesis', order: 19 }
};

contentTypesMap = Object.keys(contentTypesMap).reduce((obj, key) => {
  const o = obj;
  o[key] = {
    id: parseInt(key),
    type: PROJECT_CONTENT_TYPES[key].toLowerCase(),
    ...contentTypesMap[key]
  };
  return o;
}, {});

const projectContentTypes = [...Object.values(contentTypesMap)].sort((a, b) => a.order - b.order);

export {
  projectContentTypes
};
