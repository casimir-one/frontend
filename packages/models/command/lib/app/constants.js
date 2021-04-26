import { createEnum } from '@deip/toolbox';
import GeneralCmd from './impl/GeneralCmd';
import CreateAccountCmd from './impl/CreateAccountCmd';
import CreateProjectCmd from './impl/CreateProjectCmd';
import JoinProjectCmd from './impl/JoinProjectCmd';
import CreateProposalCmd from './impl/CreateProposalCmd';
import UpdateProposalCmd from './impl/UpdateProposalCmd';


const APP_CMD = createEnum({
  GENERAL: 1,
  CREATE_ACCOUNT: 2,
  CREATE_PROJECT: 3,
  JOIN_PROJECT: 4,
  CREATE_PROPOSAL: 5,
  UPDATE_PROPOSAL: 6
});


const APP_CMD_INFO = {
  [APP_CMD.GENERAL]: { class: GeneralCmd, isProtocolOp: false },
  [APP_CMD.CREATE_ACCOUNT]: { class: CreateAccountCmd, isProtocolOp: true },
  [APP_CMD.CREATE_PROJECT]: { class: CreateProjectCmd, isProtocolOp: true },
  [APP_CMD.JOIN_PROJECT]: { class: JoinProjectCmd, isProtocolOp: true },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd, isProtocolOp: true },
  [APP_CMD.UPDATE_PROPOSAL]: { class: UpdateProposalCmd, isProtocolOp: true }
}


export {
  APP_CMD,
  APP_CMD_INFO
}