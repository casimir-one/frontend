import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class IssueAssetCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      assetId,
      issuer,
      amount,
      recipient,
      memo
    } = cmdPayload;

    assert(!!assetId, "'assetId' is required");
    assert(!!issuer, "'issuer' is required");
    assert(!!amount, "'amount' is required");
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_ASSET, cmdPayload);
  }

}


export default IssueAssetCmd;