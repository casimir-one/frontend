import { NFT_ITEM_METADATA_TYPES } from '@deip/constants';
// TODO rethink
const contentTypesMap = {
  [NFT_ITEM_METADATA_TYPES.ANNOUNCEMENT]: { order: 1 },
  // [NFT_ITEM_METADATA_TYPES.FINAL_RESULT]: { text: 'Final Result', order: 20 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_ARTICLE]: { order: 2 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_BOOK]: { order: 3 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_CHAPTER]: { order: 4 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_CODE]: { order: 5 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_CONFERENCE_PAPER]: { order: 6 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_COVER_PAGE]: { order: 7 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_DATA]: { order: 8 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_EXPERIMENT_FINDINGS]: { order: 9 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_METHOD]: { order: 10 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_NEGATIVE_RESULTS]: { order: 11 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_PATENT]: { order: 12 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_POSTER]: { order: 13 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_PREPRINT]: { order: 14 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_PRESENTATION]: { order: 15 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_RAW_DATA]: { order: 16 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_NFT_COLLECTION_PROPOSAL]: { order: 17 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_TECHNICAL_REPORT]: { order: 18 },
  [NFT_ITEM_METADATA_TYPES.MILESTONE_THESIS]: { order: 19 }
};

const contentTypesMapExtended = Object.keys(contentTypesMap).reduce((obj, key) => {
  const o = obj;
  o[key] = {
    value: parseInt(key),
    key: NFT_ITEM_METADATA_TYPES[key],
    ...contentTypesMap[key]
  };
  return o;
}, {});

export const projectContentTypes = [...Object.values(contentTypesMapExtended)]
  .sort((a, b) => a.order - b.order);
