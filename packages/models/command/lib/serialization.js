import { APP_CMD } from '@deip/constants';
import CreateAccountCmd from './impl/CreateAccountCmd';
import CreateProjectCmd from './impl/CreateProjectCmd';
import UpdateProjectCmd from './impl/UpdateProjectCmd';
import DeleteProjectCmd from './impl/DeleteProjectCmd';
import JoinTeamCmd from './impl/JoinTeamCmd';
import CreateProposalCmd from './impl/CreateProposalCmd';
import UpdateProposalCmd from './impl/UpdateProposalCmd';
import DeclineProposalCmd from './impl/DeclineProposalCmd';
import UpdateAccountCmd from './impl/UpdateAccountCmd';
import CreateAttributeCmd from './impl/CreateAttributeCmd';
import UpdateAttributeCmd from './impl/UpdateAttributeCmd';
import DeleteAttributeCmd from './impl/DeleteAttributeCmd';
import LeaveTeamCmd from './impl/LeaveTeamCmd';
import CreateInvestmentOpportunityCmd from './impl/CreateInvestmentOpportunityCmd';
import InvestCmd from './impl/InvestCmd';
import AssetTransferCmd from './impl/AssetTransferCmd';
import CreateDocumentTemplateCmd from './impl/CreateDocumentTemplateCmd';
import UpdateDocumentTemplateCmd from './impl/UpdateDocumentTemplateCmd';
import DeleteDocumentTemplateCmd from './impl/DeleteDocumentTemplateCmd';
import CreateAssetCmd from './impl/CreateAssetCmd';
import IssueAssetCmd from './impl/IssueAssetCmd';
import CreateDraftCmd from './impl/CreateDraftCmd';
import UpdateDraftCmd from './impl/UpdateDraftCmd';
import DeleteDraftCmd from './impl/DeleteDraftCmd';
import CreateProjectContentCmd from './impl/CreateProjectContentCmd';
import CreateReviewRequestCmd from './impl/CreateReviewRequestCmd';
import DeclineReviewRequestCmd from './impl/DeclineReviewRequestCmd';
import CreateReviewCmd from './impl/CreateReviewCmd';
import UpvoteReviewCmd from './impl/UpvoteReviewCmd';
import CreateProjectNdaCmd from './impl/CreateProjectNdaCmd';
import CreateContractAgreementCmd from './impl/CreateContractAgreementCmd';
import AcceptContractAgreementCmd from './impl/AcceptContractAgreementCmd';
import RejectContractAgreementCmd from './impl/RejectContractAgreementCmd';
import DeleteUserProfileCmd from './impl/DeleteUserProfileCmd';
import UpdateAttributeSettingsCmd from './impl/UpdateAttributeSettingsCmd';
import UpdateLayoutCmd from './impl/UpdateLayoutCmd';
import UpdateLayoutSettingsCmd from './impl/UpdateLayoutSettingsCmd';
import UpdateNetworkSettingsCmd from './impl/UpdateNetworkSettingsCmd';
import UpdatePortalProfileCmd from './impl/UpdatePortalProfileCmd';
import UpdatePortalSettingsCmd from './impl/UpdatePortalSettingsCmd';


const APP_CMD_INFO = {
  [APP_CMD.CREATE_ACCOUNT]: { class: CreateAccountCmd },
  [APP_CMD.UPDATE_ACCOUNT]: { class: UpdateAccountCmd },
  [APP_CMD.CREATE_PROJECT]: { class: CreateProjectCmd },
  [APP_CMD.UPDATE_PROJECT]: { class: UpdateProjectCmd },
  [APP_CMD.DELETE_PROJECT]: { class: DeleteProjectCmd },
  [APP_CMD.JOIN_TEAM]: { class: JoinTeamCmd },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd },
  [APP_CMD.UPDATE_PROPOSAL]: { class: UpdateProposalCmd },
  [APP_CMD.DECLINE_PROPOSAL]: { class: DeclineProposalCmd },
  [APP_CMD.CREATE_ATTRIBUTE]: { class: CreateAttributeCmd },
  [APP_CMD.UPDATE_ATTRIBUTE]: { class: UpdateAttributeCmd },
  [APP_CMD.DELETE_ATTRIBUTE]: { class: DeleteAttributeCmd },
  [APP_CMD.LEAVE_TEAM]: { class: LeaveTeamCmd },
  [APP_CMD.CREATE_INVESTMENT_OPPORTUNITY]: { class: CreateInvestmentOpportunityCmd },
  [APP_CMD.INVEST]: { class: InvestCmd },
  [APP_CMD.ASSET_TRANSFER]: { class: AssetTransferCmd },
  [APP_CMD.CREATE_DOCUMENT_TEMPLATE]: { class: CreateDocumentTemplateCmd },
  [APP_CMD.UPDATE_DOCUMENT_TEMPLATE]: { class: UpdateDocumentTemplateCmd },
  [APP_CMD.DELETE_DOCUMENT_TEMPLATE]: { class: DeleteDocumentTemplateCmd },
  [APP_CMD.CREATE_ASSET]: { class: CreateAssetCmd },
  [APP_CMD.ISSUE_ASSET]: { class: IssueAssetCmd },
  [APP_CMD.CREATE_DRAFT]: { class: CreateDraftCmd },
  [APP_CMD.DELETE_DRAFT]: { class: DeleteDraftCmd },
  [APP_CMD.UPDATE_DRAFT]: { class: UpdateDraftCmd },
  [APP_CMD.CREATE_PROJECT_CONTENT]: { class: CreateProjectContentCmd },
  [APP_CMD.CREATE_REVIEW_REQUEST]: { class: CreateReviewRequestCmd },
  [APP_CMD.DECLINE_REVIEW_REQUEST]: { class: DeclineReviewRequestCmd },
  [APP_CMD.CREATE_REVIEW]: { class: CreateReviewCmd },
  [APP_CMD.UPVOTE_REVIEW]: { class: UpvoteReviewCmd },
  [APP_CMD.CREATE_PROJECT_NDA]: { class: CreateProjectNdaCmd },
  [APP_CMD.CREATE_CONTRACT_AGREEMENT]: { class: CreateContractAgreementCmd },
  [APP_CMD.ACCEPT_CONTRACT_AGREEMENT]: { class: AcceptContractAgreementCmd },
  [APP_CMD.REJECT_CONTRACT_AGREEMENT]: { class: RejectContractAgreementCmd },
  [APP_CMD.UPDATE_PORTAL_PROFILE]: { class: UpdatePortalProfileCmd },
  [APP_CMD.UPDATE_PORTAL_SETTINGS]: { class: UpdatePortalSettingsCmd },
  [APP_CMD.UPDATE_LAYOUT]: { class: UpdateLayoutCmd },
  [APP_CMD.UPDATE_LAYOUT_SETTINGS]: { class: UpdateLayoutSettingsCmd },
  [APP_CMD.UPDATE_ATTRIBUTE_SETTINGS]: { class: UpdateAttributeSettingsCmd },
  [APP_CMD.UPDATE_NETWORK_SETTINGS]: { class: UpdateNetworkSettingsCmd },
  [APP_CMD.DELETE_USER_PROFILE]: { class: DeleteUserProfileCmd }
}


export {
  APP_CMD_INFO
};
