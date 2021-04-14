import { createEnum } from '@deip/toolbox';
import GeneralCmd from './app/GeneralCmd';
import CreateProjectCmd from './app/CreateProjectCmd';
import CreateProposalCmd from './app/CreateProposalCmd';

const APP_CMD = createEnum({
  GENERAL: 1,
  CREATE_PROJECT: 2,
  CREATE_PROPOSAL: 3
});


const APP_CMD_INFO = {
  [APP_CMD.GENERAL]: { class: GeneralCmd, isProtocolOp: false },
  [APP_CMD.CREATE_PROJECT]: { class: CreateProjectCmd, isProtocolOp: true },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd, isProtocolOp: true }
}


export {
  APP_CMD,
  APP_CMD_INFO
}