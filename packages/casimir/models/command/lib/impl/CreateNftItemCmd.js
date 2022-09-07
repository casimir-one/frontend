import { APP_CMD } from '@casimir.one/platform-core';
import { assert, isNumber, isString } from '@casimir.one/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {import('@casimir.one/platform-core').NonFungibleTokenCreateData} NonFungibleTokenIssueCmdPayload
 */

/**
 * Create nft item command
 * @extends ProtocolCmd
 */
class CreateNftItemCmd extends ProtocolCmd {
  /**
   * Create nft item
   * @param {NonFungibleTokenIssueCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      issuer,
      nftCollectionId,
      nftItemId,
      recipient
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(
      isNumber(nftCollectionId) || (isString(nftCollectionId) && nftCollectionId.length),
      "'nftCollectionId' is required and must be a number or non emplty string"
    );
    assert(
      isNumber(nftItemId) || (isString(nftItemId) && nftItemId.length),
      "'nftItemId' is required and must be a number or non emplty string"
    );
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.CREATE_NFT_ITEM, cmdPayload);
  }
}

export default CreateNftItemCmd;
