import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isNumber } from '@deip/toolbox';


class CreateAssetCmd extends ProtocolEntityCmd {

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
    assert(!!maxSupply, "'maxSupply' is required");

    if (projectTokenOption) {
      const { projectId, teamId, licenseRevenue } = projectTokenOption;
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