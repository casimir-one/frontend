import { PROJECT_CONTENT_TYPES } from '@deip/constants';
// TODO rethink
const contentTypesMap = {
  [PROJECT_CONTENT_TYPES.ANNOUNCEMENT]: { order: 1 },
  // [PROJECT_CONTENT_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [PROJECT_CONTENT_TYPES.MILESTONE_ARTICLE]: { order: 2 },
  [PROJECT_CONTENT_TYPES.MILESTONE_BOOK]: { order: 3 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CHAPTER]: { order: 4 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CODE]: { order: 5 },
  [PROJECT_CONTENT_TYPES.MILESTONE_CONFERENCE_PAPER]: { order: 6 },
  [PROJECT_CONTENT_TYPES.MILESTONE_COVER_PAGE]: { order: 7 },
  [PROJECT_CONTENT_TYPES.MILESTONE_DATA]: { order: 8 },
  [PROJECT_CONTENT_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { order: 9 },
  [PROJECT_CONTENT_TYPES.MILESTONE_METHOD]: { order: 10 },
  [PROJECT_CONTENT_TYPES.MILESTONE_NEGATIVE_RESULTS]: { order: 11 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PATENT]: { order: 12 },
  [PROJECT_CONTENT_TYPES.MILESTONE_POSTER]: { order: 13 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PREPRINT]: { order: 14 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PRESENTATION]: { order: 15 },
  [PROJECT_CONTENT_TYPES.MILESTONE_RAW_DATA]: { order: 16 },
  [PROJECT_CONTENT_TYPES.MILESTONE_PROJECT_PROPOSAL]: { order: 17 },
  [PROJECT_CONTENT_TYPES.MILESTONE_TECHNICAL_REPORT]: { order: 18 },
  [PROJECT_CONTENT_TYPES.MILESTONE_THESIS]: { order: 19 }
};

const contentTypesMapExtended = Object.keys(contentTypesMap).reduce((obj, key) => {
  const o = obj;
  o[key] = {
    value: parseInt(key),
    key: PROJECT_CONTENT_TYPES[key],
    ...contentTypesMap[key]
  };
  return o;
}, {});

export const projectContentTypes = [...Object.values(contentTypesMapExtended)]
  .sort((a, b) => a.order - b.order);
