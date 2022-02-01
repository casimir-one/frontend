/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create non-fungible token class command
 * @extends ProtocolEntityCmd
 */
class CreateNonFungibleTokenCmd extends ProtocolEntityCmd {
  /**
   * Create non-fungible token class
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.symbol
   * @param {string} cmdPayload.description
   * @param {Object} cmdPayload.projectTokenSettings
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      symbol,
      description,
      projectTokenSettings
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(!!symbol, "'symbol' is required");

    if (projectTokenSettings) { // keep this until we have working F-NFT
      const { projectId, teamId, licenseRevenue } = projectTokenSettings;
      assert(!!projectId, "'projectId' is required for project token");
      assert(!!teamId, "'teamId' is required for project token");

      if (licenseRevenue) {
        const { holdersShare } = licenseRevenue;
        assert(!!holdersShare, "'holdersShare' is required for project 'licenseRevenue' option");
      }
    }

    super(APP_CMD.CREATE_NFT, cmdPayload);
  }
}

export default CreateNonFungibleTokenCmd;
