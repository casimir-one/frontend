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
class CreateNonFungibleTokenCmd extends ProtocolEntityCmd {
  /**
   * Create non-fungible token class
   * @param {NonFungibleTokenCreateCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      name,
      description,
      metadata
    } = cmdPayload;

    assert(isNumber(entityId) || (isString(entityId) && entityId),
      "'entityId' must be a number or non emplty string");
    assert(!!issuer, "'issuer' is required");

    if (metadata) { // keep this until we have working F-NFT
      const { projectId } = metadata;
      assert(!!projectId, "'projectId' is required for project token");
    }

    super(APP_CMD.CREATE_NFT, cmdPayload);
  }
}

export default CreateNonFungibleTokenCmd;
