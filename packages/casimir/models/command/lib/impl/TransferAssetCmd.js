import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class TransferAssetCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      from,
      to,
      asset
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");
    assert(
      !!asset
      && asset.id
      && asset.symbol
      && !isNaN(asset.precision)
      && asset.amount,
      "'asset' is required and should contains 'id', 'symbol', 'precision', 'amount' fields"
    )

    super(APP_CMD.TRANSFER_ASSET, cmdPayload);
  }

}


export default TransferAssetCmd;
