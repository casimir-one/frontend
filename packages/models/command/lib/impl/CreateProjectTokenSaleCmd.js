import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from './../constants';
import { assert, isBoolean } from '@deip/toolbox';


class CreateProjectTokenSaleCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      teamId,
      projectId,
      startTime,
      endTime,
      securityTokensOnSale,
      softCap,
      hardCap
    } = cmdPayload;

    assert(!!teamId, "'teamId' is required");
    assert(!!projectId, "'projectId' is required");
    assert(!!startTime, "'startTime' is required");
    assert(!!endTime, "'endTime' is required");
    assert(new Date(endTime) > new Date(startTime), "'endTime' must be greater than 'startTime'");
    assert(!!securityTokensOnSale, "'securityTokensOnSale' is required");
    assert(!!softCap, "'softCap' is required");
    assert(!!hardCap, "'hardCap' is required");

    super(APP_CMD.CREATE_PROJECT_TOKEN_SALE, cmdPayload);
  }

}


export default CreateProjectTokenSaleCmd;