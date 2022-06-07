import { APP_CMD, NFT_ITEM_METADATA_FORMAT } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update nft item metadata draft command
 * @extends AppCmd
 */
class UpdateNftItemMetadataDraftCmd extends AppCmd {
  /**
   * Create command for nft item metadata draft update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {Object} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {string} cmdPayload.title
   * @param {string} cmdPayload.lazySellProposalId //TODO: remove when we have onchain market
   * @param {number} cmdPayload.contentType
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<string>} cmdPayload.references
   * @param {Array.<Object>} cmdPayload.attributes
   * @param {number} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      _id,
      formatType,
      jsonData
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    if (formatType && formatType === NFT_ITEM_METADATA_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }

    super(APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT, cmdPayload);
  }
}

export default UpdateNftItemMetadataDraftCmd;
