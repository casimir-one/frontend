import { PROTOCOL } from './../../constants';
import BaseTxBuilder from './../../base/BaseTxBuilder';
import PolkadotTx from './../polkadot/PolkadotTx';

class PolkadotTxBuilder extends BaseTxBuilder {
  constructor(api) {
    super(api, PROTOCOL.POLKADOT);
  }

  // TODO: implementation for polkadot
}


export default PolkadotTxBuilder;