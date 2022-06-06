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
class UpdateNonFungibleTokenTeamCmd extends ProtocolEntityCmd {
  /**
   * Create non-fungible token class
   * @param {NonFungibleTokenCreateCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      newAdmin,
      newFreezer,
      newIssuer
    } = cmdPayload;

    assert(isNumber(entityId) || (isString(entityId) && entityId),
      "'entityId' must be a number or non emplty string");
    assert(!!issuer, "'issuer' is required");
    assert(!!newAdmin, "'newAdmin' is required");
    assert(!!newFreezer, "'newFreezer' is required");
    assert(!!newIssuer, "'newIssuer' is required");

    super(APP_CMD.UPDATE_NFT_TEAM, cmdPayload);
  }
}

export default UpdateNonFungibleTokenTeamCmd;
