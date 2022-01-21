import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';
import { ASSET_TYPE } from '@deip/constants';


// TODO: Split this command to separate TransferFungibleToken and TransferNonFungibleToken
class TransferAssetCmd extends ProtocolCmd {

  constructor(cmdPayload) {
    const {
      from,
      to,

      assetType, // tmp

      // FT
      tokenId,
      symbol,
      precision,
      amount,

      // NFT
      classId,
      instanceId
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");

    if (assetType == ASSET_TYPE.NFT) {
      assert(!!classId, "NFT 'classId' is required");
      assert(!!instanceId && !isNaN(instanceId), "NFT 'instanceId' is required");
    } else {
      assert(!!tokenId, "FT 'tokenId' is required");
      assert(!!symbol, "FT 'symbol' is required");
      assert(!isNaN(precision), "FT 'precision' is required");
      assert(!!amount, "FT 'amount' is required");
    }

    super(APP_CMD.TRANSFER_ASSET, cmdPayload);
  }
}

export default TransferAssetCmd;
