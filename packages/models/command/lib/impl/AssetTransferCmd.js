import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class AssetTransferCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      from,
      to,
      amount,
      memo
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");
    assert(!!amount, "'amount' is required");

    super(APP_CMD.ASSET_TRANSFER, cmdPayload);
  }

}


export default AssetTransferCmd;
