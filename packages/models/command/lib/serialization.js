import { APP_CMD, PROTOCOL_CHAIN } from '@deip/constants';
import { GrapheneTx, GrapheneTxBuilder, SubstrateTx, SubstrateTxBuilder } from '@deip/chain-service';
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
import CreateInvestmentOpportunityCmd from './impl/CreateInvestmentOpportunityCmd';
import InvestCmd from './impl/InvestCmd';
import AssetTransferCmd from './impl/AssetTransferCmd';
import CreateDocumentTemplateCmd from './impl/CreateDocumentTemplateCmd';
import UpdateDocumentTemplateCmd from './impl/UpdateDocumentTemplateCmd';
import DeleteDocumentTemplateCmd from './impl/DeleteDocumentTemplateCmd';


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
  [APP_CMD.LEAVE_PROJECT_TEAM]: { class: LeaveProjectTeamCmd },
  [APP_CMD.CREATE_INVESTMENT_OPPORTUNITY]: { class: CreateInvestmentOpportunityCmd },
  [APP_CMD.INVEST]: { class: InvestCmd },
  [APP_CMD.ASSET_TRANSFER]: { class: AssetTransferCmd },
  [APP_CMD.CREATE_DOCUMENT_TEMPLATE]: { class: CreateDocumentTemplateCmd },
  [APP_CMD.UPDATE_DOCUMENT_TEMPLATE]: { class: UpdateDocumentTemplateCmd },
  [APP_CMD.DELETE_DOCUMENT_TEMPLATE]: { class: DeleteDocumentTemplateCmd },
}

const APP_PROTOCOL_CHAIN_INFO = {
  [PROTOCOL_CHAIN.GRAPHENE]: { txClass: GrapheneTx, txBuilderClass: GrapheneTxBuilder },
  [PROTOCOL_CHAIN.SUBSTRATE]: { txClass: SubstrateTx, txBuilderClass: SubstrateTxBuilder }
}


export {
  APP_CMD_INFO,
  APP_PROTOCOL_CHAIN_INFO
};
