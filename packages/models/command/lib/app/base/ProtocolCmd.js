import BaseCmd from './BaseCmd';
import { assert } from '@deip/toolbox';
import { APP_CMD_INFO } from './../../constants';
import ProtocolRegistry from './../../protocol/registry';

const protocolRegistry = new ProtocolRegistry("graphene"); // TODO move to a service based on ENV var


class ProtocolCmd extends BaseCmd {

  constructor(cmdNum, cmdPayload, txContext = {}) {
    super(cmdNum, cmdPayload);
    const opRegistry = protocolRegistry.getOperationsRegistry();
    this._protocolOp = opRegistry.get(cmdNum)(cmdPayload, txContext);
  }

  isProtocolOpCmd() { return true; }
  getProtocolOp() { return this._protocolOp; }

}


export default ProtocolCmd;