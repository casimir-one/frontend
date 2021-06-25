import BaseTx from './../../base/BaseTx';
import { PROTOCOL_CHAIN } from './../../constants';


class SubstrateTx extends BaseTx {
  constructor({ operations }) {
    super({ operations });
  }
  
  getProtocolChain() { return PROTOCOL_CHAIN.SUBSTRATE; };

  // TODO: implementation for substrate
}


export default SubstrateTx;