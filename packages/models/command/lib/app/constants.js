import { createEnum } from '@deip/toolbox';
import GeneralCmd from './impl/GeneralCmd';
import CreateProjectCmd from './impl/CreateProjectCmd';
import CreateProposalCmd from './impl/CreateProposalCmd';
import SendProtocolTxCmd from './impl/SendProtocolTxCmd';


const APP_CMD = createEnum({
  GENERAL: 1,
  SEND_PROTOCOL_TX: 2,
  CREATE_PROJECT: 3,
  CREATE_PROPOSAL: 4
});


const APP_CMD_INFO = {
  [APP_CMD.GENERAL]: { class: GeneralCmd, isProtocolOp: false },
  [APP_CMD.SEND_PROTOCOL_TX]: { class: SendProtocolTxCmd, isProtocolOp: false },
  [APP_CMD.CREATE_PROJECT]: { class: CreateProjectCmd, isProtocolOp: true },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd, isProtocolOp: true }
}


export {
  APP_CMD,
  APP_CMD_INFO
}