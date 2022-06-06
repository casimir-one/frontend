/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert, isNumber, isString } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * @typedef {{entityId: string} & import('@casimir/platform-core').NonFungibleTokenCreateData} NonFungibleTokenCreateCmdPayload
 */

/**
 * Create non-fungible token class command
 * @extends ProtocolEntityCmd
 */
class UpdateNonFungibleTokenOwnerCmd extends ProtocolEntityCmd {
  /**
   * Create non-fungible token class
   * @param {NonFungibleTokenCreateCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      owner
    } = cmdPayload;

    assert(isNumber(entityId) || (isString(entityId) && entityId),
      "'entityId' must be a number or non emplty string");
    assert(!!issuer, "'issuer' is required");
    assert(!!owner, "'owner' is required");

    super(APP_CMD.UPDATE_NFT_OWNER, cmdPayload);
  }
}

export default UpdateNonFungibleTokenOwnerCmd;
