/* eslint-disable no-unused-vars */
import { APP_CMD } from '@casimir/platform-core';
import { assert, isNumber, isString } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * @typedef {{entityId: string} & import('@casimir/platform-core').FungibleTokenCreateData} FungibleTokenCreateCmdPayload
 */

/**
 * Create fungible token command
 * @extends ProtocolEntityCmd
 */
class CreateFTClassCmd extends ProtocolEntityCmd {
  /**
   * Create fungible token
   * @param {FungibleTokenCreateCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      symbol,
      precision,
      minBalance,
      description,
      metadata
    } = cmdPayload;

    assert(
      isNumber(entityId) || (isString(entityId) && entityId),
      "'entityId' is required and must be a number or non emplty string"
    );
    assert(!!issuer, "'issuer' is required");
    assert(!!symbol, "'symbol' is required");
    assert(isNumber(precision), "'precision' is required and must be a number");

    super(APP_CMD.CREATE_FT, cmdPayload);
  }
}

export default CreateFTClassCmd;
