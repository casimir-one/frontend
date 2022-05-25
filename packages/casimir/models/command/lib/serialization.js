import { APP_CMD } from '@deip/constants';
import CreateDaoCmd from './impl/CreateDaoCmd';
import CreateNftCollectionMetadataCmd from './impl/CreateNftCollectionMetadataCmd';
import UpdateNftCollectionMetadataCmd from './impl/UpdateNftCollectionMetadataCmd';
import AddDaoMemberCmd from './impl/AddDaoMemberCmd';
import CreateProposalCmd from './impl/CreateProposalCmd';
import AcceptProposalCmd from './impl/AcceptProposalCmd';
import DeclineProposalCmd from './impl/DeclineProposalCmd';
import UpdateDaoCmd from './impl/UpdateDaoCmd';
import AlterDaoAuthorityCmd from './impl/AlterDaoAuthorityCmd';
import CreateAttributeCmd from './impl/CreateAttributeCmd';
import UpdateAttributeCmd from './impl/UpdateAttributeCmd';
import DeleteAttributeCmd from './impl/DeleteAttributeCmd';
import RemoveDaoMemberCmd from './impl/RemoveDaoMemberCmd';
import CreateInvestmentOpportunityCmd from './impl/CreateInvestmentOpportunityCmd';
import InvestCmd from './impl/InvestCmd';
import TransferFungibleTokenCmd from './impl/TransferFungibleTokenCmd';
import TransferNonFungibleTokenCmd from './impl/TransferNonFungibleTokenCmd';
import CreateDocumentTemplateCmd from './impl/CreateDocumentTemplateCmd';
import UpdateDocumentTemplateCmd from './impl/UpdateDocumentTemplateCmd';
import DeleteDocumentTemplateCmd from './impl/DeleteDocumentTemplateCmd';
import CreateFungibleTokenCmd from './impl/CreateFungibleTokenCmd';
import CreateNftCollectionCmd from './impl/CreateNftCollectionCmd';
import IssueFungibleTokenCmd from './impl/IssueFungibleTokenCmd';
import CreateNftItemCmd from './impl/CreateNftItemCmd';
import CreateNftItemMetadataDraftCmd from './impl/CreateNftItemMetadataDraftCmd';
import UpdateNftItemMetadataDraftCmd from './impl/UpdateNftItemMetadataDraftCmd';
import DeleteNftItemMetadataDraftCmd from './impl/DeleteNftItemMetadataDraftCmd';
import CreateNftItemMetadataCmd from './impl/CreateNftItemMetadataCmd';
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
import CreateLayoutCmd from './impl/CreateLayoutCmd';
import UpdateLayoutCmd from './impl/UpdateLayoutCmd';
import DeleteLayoutCmd from './impl/DeleteLayoutCmd';
import UpdateLayoutSettingsCmd from './impl/UpdateLayoutSettingsCmd';
import UpdateNetworkSettingsCmd from './impl/UpdateNetworkSettingsCmd';
import UpdatePortalProfileCmd from './impl/UpdatePortalProfileCmd';
import UpdatePortalSettingsCmd from './impl/UpdatePortalSettingsCmd';
import CreateBookmarkCmd from './impl/CreateBookmarkCmd';
import DeleteBookmarkCmd from './impl/DeleteBookmarkCmd';
import MarkNotificationsAsReadCmd from './impl/MarkNotificationsAsReadCmd';
import UpdateNftItemMetadataDraftStatusCmd from './impl/UpdateNftItemMetadataDraftStatusCmd';
import UpdateNftItemMetadataDraftModerationMsgCmd
  from './impl/UpdateNftItemMetadataDraftModerationMsgCmd';
import SendRegistrationCodeByEmailCmd from './impl/SendRegistrationCodeByEmailCmd';

const APP_CMD_INFO = {
  [APP_CMD.CREATE_DAO]: { class: CreateDaoCmd },
  [APP_CMD.UPDATE_DAO]: { class: UpdateDaoCmd },
  [APP_CMD.ALTER_DAO_AUTHORITY]: { class: AlterDaoAuthorityCmd },
  [APP_CMD.CREATE_NFT_COLLECTION_METADATA]: { class: CreateNftCollectionMetadataCmd },
  [APP_CMD.UPDATE_NFT_COLLECTION_METADATA]: { class: UpdateNftCollectionMetadataCmd },
  [APP_CMD.ADD_DAO_MEMBER]: { class: AddDaoMemberCmd },
  [APP_CMD.CREATE_PROPOSAL]: { class: CreateProposalCmd },
  [APP_CMD.ACCEPT_PROPOSAL]: { class: AcceptProposalCmd },
  [APP_CMD.DECLINE_PROPOSAL]: { class: DeclineProposalCmd },
  [APP_CMD.CREATE_ATTRIBUTE]: { class: CreateAttributeCmd },
  [APP_CMD.UPDATE_ATTRIBUTE]: { class: UpdateAttributeCmd },
  [APP_CMD.DELETE_ATTRIBUTE]: { class: DeleteAttributeCmd },
  [APP_CMD.REMOVE_DAO_MEMBER]: { class: RemoveDaoMemberCmd },
  [APP_CMD.CREATE_INVESTMENT_OPPORTUNITY]: { class: CreateInvestmentOpportunityCmd },
  [APP_CMD.INVEST]: { class: InvestCmd },
  [APP_CMD.TRANSFER_FT]: { class: TransferFungibleTokenCmd },
  [APP_CMD.TRANSFER_NFT]: { class: TransferNonFungibleTokenCmd },
  [APP_CMD.CREATE_DOCUMENT_TEMPLATE]: { class: CreateDocumentTemplateCmd },
  [APP_CMD.UPDATE_DOCUMENT_TEMPLATE]: { class: UpdateDocumentTemplateCmd },
  [APP_CMD.DELETE_DOCUMENT_TEMPLATE]: { class: DeleteDocumentTemplateCmd },
  [APP_CMD.CREATE_FT]: { class: CreateFungibleTokenCmd },
  [APP_CMD.CREATE_NFT_COLLECTION]: { class: CreateNftCollectionCmd },
  [APP_CMD.ISSUE_FT]: { class: IssueFungibleTokenCmd },
  [APP_CMD.CREATE_NFT_ITEM]: { class: CreateNftItemCmd },
  [APP_CMD.CREATE_NFT_ITEM_METADATA_DRAFT]: { class: CreateNftItemMetadataDraftCmd },
  [APP_CMD.DELETE_NFT_ITEM_METADATA_DRAFT]: { class: DeleteNftItemMetadataDraftCmd },
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT]: { class: UpdateNftItemMetadataDraftCmd },
  [APP_CMD.CREATE_NFT_ITEM_METADATA]: { class: CreateNftItemMetadataCmd },
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
  [APP_CMD.CREATE_LAYOUT]: { class: CreateLayoutCmd },
  [APP_CMD.UPDATE_LAYOUT]: { class: UpdateLayoutCmd },
  [APP_CMD.DELETE_LAYOUT]: { class: DeleteLayoutCmd },
  [APP_CMD.UPDATE_LAYOUT_SETTINGS]: { class: UpdateLayoutSettingsCmd },
  [APP_CMD.UPDATE_ATTRIBUTE_SETTINGS]: { class: UpdateAttributeSettingsCmd },
  [APP_CMD.UPDATE_NETWORK_SETTINGS]: { class: UpdateNetworkSettingsCmd },
  [APP_CMD.DELETE_USER_PROFILE]: { class: DeleteUserProfileCmd },
  [APP_CMD.CREATE_BOOKMARK]: { class: CreateBookmarkCmd },
  [APP_CMD.DELETE_BOOKMARK]: { class: DeleteBookmarkCmd },
  [APP_CMD.MARK_NOTIFICATIONS_AS_READ]: { class: MarkNotificationsAsReadCmd },
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_STATUS]: { class: UpdateNftItemMetadataDraftStatusCmd },
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_MODERATION_MSG]: {
    class: UpdateNftItemMetadataDraftModerationMsgCmd
  },
  [APP_CMD.SEND_REGISTRATION_CODE_BY_EMAIL]: { class: SendRegistrationCodeByEmailCmd }
};

export {
  APP_CMD_INFO
};
