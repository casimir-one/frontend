import { createEnum } from '@deip/toolbox';

const NFT_ITEM_METADATA_DRAFT_STATUS = createEnum({
  IN_PROGRESS: 1,
  PROPOSED: 2,
  REJECTED: 3,
  APPROVED: 4
});

const NFT_ITEM_METADATA_FORMAT = createEnum({
  DAR: 1,
  PACKAGE: 2,
  JSON: 3
});

export {
  NFT_ITEM_METADATA_DRAFT_STATUS,
  NFT_ITEM_METADATA_FORMAT
};
