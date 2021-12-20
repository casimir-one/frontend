import { RESEARCH_CONTENT_TYPES } from '@deip/constants';
// TODO rethink
const contentTypesMap = {
  [RESEARCH_CONTENT_TYPES.ANNOUNCEMENT]: { order: 1 },
  // [RESEARCH_CONTENT_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_ARTICLE]: { order: 2 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_BOOK]: { order: 3 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CHAPTER]: { order: 4 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CODE]: { order: 5 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_CONFERENCE_PAPER]: { order: 6 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_COVER_PAGE]: { order: 7 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_DATA]: { order: 8 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { order: 9 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_METHOD]: { order: 10 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_NEGATIVE_RESULTS]: { order: 11 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PATENT]: { order: 12 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_POSTER]: { order: 13 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PREPRINT]: { order: 14 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_PRESENTATION]: { order: 15 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_RAW_DATA]: { order: 16 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_RESEARCH_PROPOSAL]: { order: 17 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_TECHNICAL_REPORT]: { order: 18 },
  [RESEARCH_CONTENT_TYPES.MILESTONE_THESIS]: { order: 19 }
};

const contentTypesMapExtended = Object.keys(contentTypesMap).reduce((obj, key) => {
  const o = obj;
  o[key] = {
    value: parseInt(key),
    key: RESEARCH_CONTENT_TYPES[key],
    ...contentTypesMap[key]
  };
  return o;
}, {});

export const projectContentTypes = [...Object.values(contentTypesMapExtended)]
  .sort((a, b) => a.order - b.order);
