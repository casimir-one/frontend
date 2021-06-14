import { createEnum } from '@deip/toolbox';
import CreateAccountCmd from './impl/CreateAccountCmd';
import CreateProjectCmd from './impl/CreateProjectCmd';
import UpdateProjectCmd from './impl/UpdateProjectCmd';
import DeleteProjectCmd from './impl/DeleteProjectCmd';
import JoinProjectTeamCmd from './impl/JoinProjectTeamCmd';
import CreateProposalCmd from './impl/CreateProposalCmd';
import UpdateProposalCmd from './impl/UpdateProposalCmd';
import DeclineProposalCmd from './impl/DeclineProposalCmd';
import UpdateAccountCmd from './impl/UpdateAccountCmd';
import CreateAttributeCmd from './impl/CreateAttributeCmd';
import UpdateAttributeCmd from './impl/UpdateAttributeCmd';
import DeleteAttributeCmd from './impl/DeleteAttributeCmd';
import LeaveProjectTeamCmd from './impl/LeaveProjectTeamCmd';


const APP_CMD = createEnum({
  CREATE_ACCOUNT: 1,
  UPDATE_ACCOUNT: 2,
  CREATE_PROJECT: 3,
  UPDATE_PROJECT: 4,
  DELETE_PROJECT: 5,
  JOIN_PROJECT_TEAM: 6,
  CREATE_PROPOSAL: 7,
  UPDATE_PROPOSAL: 8,
  DECLINE_PROPOSAL: 9,
  CREATE_ATTRIBUTE: 10,
  UPDATE_ATTRIBUTE: 11,
  DELETE_ATTRIBUTE: 12,
  LEAVE_PROJECT_TEAM: 13
});


const APP_PROPOSAL = createEnum({
  PROJECT_PROPOSAL: 1,
  PROJECT_UPDATE_PROPOSAL: 2,
  PROJECT_CONTENT_PROPOSAL: 3,
  PROJECT_FUNDRASE_PROPOSAL: 4,
  TEAM_UPDATE_PROPOSAL: 5,
  PROJECT_INVITE_PROPOSAL: 6,
  PROJECT_LEAVE_PROPOSAL: 7,
  ASSET_TRANSFER_PROPOSAL: 8,
  EXPRESS_LICENSE_PROPOSAL: 9,
  ASSET_EXCHANGE_PROPOSAL: 10,
  PROJECT_NDA_PROPOSAL: 11
});


const APP_CMD_INFO = {
  [APP_CMD.CREATE_ACCOUNT]: { class: CreateAccountCmd },
  [APP_CMD.UPDATE_ACCOUNT]: { class: UpdateAccountCmd },
  [APP_CMD.CREATE_PROJECT]: { class: CreateProjectCmd },
  [APP_CMD.UPDATE_PROJECT]: { class: UpdateProjectCmd },
  [APP_CMD.DELETE_PROJECT]: { class: DeleteProjectCmd },  
  [APP_CMD.JOIN_PROJECT_TEAM]: { class: JoinProjectTeamCmd },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd },
  [APP_CMD.UPDATE_PROPOSAL]: { class: UpdateProposalCmd },
  [APP_CMD.DECLINE_PROPOSAL]: { class: DeclineProposalCmd },
  [APP_CMD.CREATE_ATTRIBUTE]: { class: CreateAttributeCmd },
  [APP_CMD.UPDATE_ATTRIBUTE]: { class: UpdateAttributeCmd },
  [APP_CMD.DELETE_ATTRIBUTE]: { class: DeleteAttributeCmd },
  [APP_CMD.LEAVE_PROJECT_TEAM]: { class: LeaveProjectTeamCmd }
}


export {
  APP_CMD,
  APP_CMD_INFO,
  APP_PROPOSAL
}