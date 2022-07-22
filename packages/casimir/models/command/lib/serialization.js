import { APP_CMD } from '@casimir/platform-core';
import CreateDaoCmd from './impl/CreateDaoCmd';
import ImportDAOCmd from './impl/ImportDAOCmd';
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
import TransferFTCmd from './impl/TransferFTCmd';
import TransferNFTCmd from './impl/TransferNFTCmd';
import CreateDocumentTemplateCmd from './impl/CreateDocumentTemplateCmd';
import UpdateDocumentTemplateCmd from './impl/UpdateDocumentTemplateCmd';
import DeleteDocumentTemplateCmd from './impl/DeleteDocumentTemplateCmd';
import CreateFTClassCmd from './impl/CreateFTClassCmd';
import CreateNftCollectionCmd from './impl/CreateNftCollectionCmd';
import IssueFTCmd from './impl/IssueFTCmd';
import CreateNftItemCmd from './impl/CreateNftItemCmd';
import CreateNftItemMetadataDraftCmd from './impl/CreateNftItemMetadataDraftCmd';
import UpdateNftItemMetadataDraftCmd from './impl/UpdateNftItemMetadataDraftCmd';
import DeleteNftItemMetadataDraftCmd from './impl/DeleteNftItemMetadataDraftCmd';
import CreateNftItemMetadataCmd from './impl/CreateNftItemMetadataCmd';
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
import UpdateNftItemMetadataDraftStatusCmd from './impl/UpdateNftItemMetadataDraftStatusCmd';
import UpdateNftItemMetadataDraftModerationMsgCmd
  from './impl/UpdateNftItemMetadataDraftModerationMsgCmd';

const APP_CMD_INFO = {
  [APP_CMD.CREATE_DAO]: { class: CreateDaoCmd },
  [APP_CMD.UPDATE_DAO]: { class: UpdateDaoCmd },
  [APP_CMD.IMPORT_DAO]: { class: ImportDAOCmd },
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
  [APP_CMD.TRANSFER_FT]: { class: TransferFTCmd },
  [APP_CMD.TRANSFER_NFT]: { class: TransferNFTCmd },
  [APP_CMD.CREATE_DOCUMENT_TEMPLATE]: { class: CreateDocumentTemplateCmd },
  [APP_CMD.UPDATE_DOCUMENT_TEMPLATE]: { class: UpdateDocumentTemplateCmd },
  [APP_CMD.DELETE_DOCUMENT_TEMPLATE]: { class: DeleteDocumentTemplateCmd },
  [APP_CMD.CREATE_FT]: { class: CreateFTClassCmd },
  [APP_CMD.CREATE_NFT_COLLECTION]: { class: CreateNftCollectionCmd },
  [APP_CMD.ISSUE_FT]: { class: IssueFTCmd },
  [APP_CMD.CREATE_NFT_ITEM]: { class: CreateNftItemCmd },
  [APP_CMD.CREATE_NFT_ITEM_METADATA_DRAFT]: { class: CreateNftItemMetadataDraftCmd },
  [APP_CMD.DELETE_NFT_ITEM_METADATA_DRAFT]: { class: DeleteNftItemMetadataDraftCmd },
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT]: { class: UpdateNftItemMetadataDraftCmd },
  [APP_CMD.CREATE_NFT_ITEM_METADATA]: { class: CreateNftItemMetadataCmd },
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
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_STATUS]: { class: UpdateNftItemMetadataDraftStatusCmd },
  [APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_MODERATION_MSG]: {
    class: UpdateNftItemMetadataDraftModerationMsgCmd
  },
};

export {
  APP_CMD_INFO
};
