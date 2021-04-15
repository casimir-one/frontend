import BaseTx from './../../base/BaseTx';
import { PROTOCOL } from './../../constants';


class PolkadotTx extends BaseTx {
  constructor({ operations }) {
    super({ operations });
  }
  
  getProtocol() { return PROTOCOL.POLKADOT; };

  // TODO: implementation for polkadot
}


export default PolkadotTx;