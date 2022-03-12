/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert, isNumber } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create asset command
 * @extends ProtocolEntityCmd
 */
class CreateAssetCmd extends ProtocolEntityCmd {
  /**
   * Create command for asset creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.symbol
   * @param {number} cmdPayload.precision
   * @param {string} cmdPayload.maxSupply
   * @param {string} cmdPayload.description
   * @param {Object} cmdPayload.projectTokenOption
   * @param {string} cmdPayload.projectTokenOption.projectId
   * @param {string} cmdPayload.projectTokenOption.teamId
   * @param {Object} cmdPayload.projectTokenOption.licenseRevenue
   * @param {string} cmdPayload.projectTokenOption.licenseRevenue.holdersShare
   */
  constructor(cmdPayload) {
    const {
      entityId,
      issuer,
      symbol,
      precision,
      maxSupply,
      description,
      projectTokenOption
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(!!symbol, "'symbol' is required");
    assert(isNumber(precision), "'precision' must be a number");

    if (projectTokenOption) {
      const { projectId, teamId, licenseRevenue } = projectTokenOption; // TODO: remove 'teamId'
      assert(!!projectId, "'projectId' is required for project token");
      assert(!!teamId, "'teamId' is required for project token");

      if (licenseRevenue) {
        const { holdersShare } = licenseRevenue;
        assert(!!holdersShare, "'holdersShare' is required for project 'licenseRevenue' option");
      }
    }

    super(APP_CMD.CREATE_ASSET, cmdPayload);
  }
}

export default CreateAssetCmd;
