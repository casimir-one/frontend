import { createEnum } from '@casimir.one/toolbox';

export const enum NftItemMetadataDraftStatus {
  IN_PROGRESS = 1,
  PROPOSED = 2,
  REJECTED = 3,
  APPROVED = 4
}

/** @deprecated */
export const NFT_ITEM_METADATA_FORMAT = createEnum({
  DAR: 1,
  PACKAGE: 2,
  JSON: 3
});
