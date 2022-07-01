const CHAIN_TYPES = {
  "PortalUpdate": {
    "delegate": "Option<PortalDelegate>",
    "metadata": "Option<PortalMetadata>"
  },
  "Portal": {
    "id": "PortalId",
    "owner": "PortalOwner",
    "delegate": "PortalDelegate",
    "metadata": "PortalMetadata"
  },
  "PortalMetadata": "Option<H256>",
  "PortalDelegate": "AccountId",
  "PortalOwner": "AccountId",
  "PortalId": "TenantId",
  "UncheckedExtrinsic": "Extrinsic",
  "TenantId": "DaoId",
  "InputProposalBatch": "Vec<InputProposalBatchItem>",
  "InputProposalBatchItem": {
    "account": "DeipAccountId",
    "call": "Call"
  },
  "DeipAccountId": {
    "_enum": {
      "Native": "AccountId",
      "Dao": "DaoId"
    }
  },
  "AlterAuthority": {
    "_enum": {
      "AddMember": {
        "member": "AccountId",
        "preserve_threshold": "bool"
      },
      "RemoveMember": {
        "member": "AccountId",
        "preserve_threshold": "bool"
      },
      "ReplaceAuthority": {
        "authority_key": "AccountId",
        "authority": "Authority"
      }
    }
  },
  "InputAuthority": "Authority",
  "Authority": {
    "signatories": "Vec<AccountId>",
    "threshold": "u16"
  },
  "DaoOf": "Dao",
  "Dao": {
    "authority_key": "AccountId",
    "authority": "Authority",
    "id": "DaoId",
    "dao_key": "AccountId",
    "metadata": "Option<H256>"
  },
  "DaoId": "H160",
  "AccountInfo": {
    "nonce": "Index",
    "consumers": "RefCount",
    "providers": "RefCount",
    "sufficients": "RefCount",
    "data": "AccountData"
  },
  "ProposalBatchItemOf": {
    "account": "AccountId",
    "call": "Call"
  },
  "ProposalBatch": "Vec<ProposalBatchItemOf>",
  "ProposalId": "H160",
  "PendingProposalsMap": "BTreeMap<ProposalId,AccountId>",
  "DeipProposal": {
    "id": "ProposalId",
    "batch": "Vec<ProposalBatchItemOf>",
    "decisions": "BTreeMap<AccountId,ProposalMemberDecision>",
    "state": "ProposalState",
    "author": "AccountId"
  },
  "ProposalState": {
    "_enum": {
      "Pending": {},
      "Rejected": {},
      "Done": {},
      "Failed": { "0": "DispatchError" }
    }
  },
  "ProposalMemberDecision": {
    "_enum": [
      "Pending",
      "Approve",
      "Reject"
    ]
  },
  "ProjectId": "H160",
  "InvestmentId": "H160",
  "DeipInvestmentIdOf": "InvestmentId",
  "ProjectOf": "Project",
  "SimpleCrowdfundingOf": "SimpleCrowdfunding",
  "InvestmentOf": "Investment",
  "Project": {
    "is_private": "bool",
    "external_id": "ProjectId",
    "team": "AccountId",
    "description": "Hash"
  },
  "Weight": "u64",
  "DispatchClass": {
    "_enum": [
      "Normal",
      "Operational",
      "Mandatory"
    ]
  },
  "Pays": {
    "_enum": [
      "Yes",
      "No"
    ]
  },
  "DispatchInfo": {
    "weight": "Weight",
    "class": "DispatchClass",
    "pays_fee": "Pays"
  },
  "SimpleCrowdfundingStatus": {
    "_enum": [
      "Active",
      "Finished",
      "Expired",
      "Inactive"
    ]
  },
  "DeipAsset": {
    "id": "DeipAssetIdOf",
    "amount": {
      "0": "AssetsBalanceOf"
    }
  },
  "DeipAssetOf": "DeipAsset",
  "SimpleCrowdfunding": {
    "external_id": "InvestmentId",
    "start_time": "Moment",
    "end_time": "Moment",
    "status": "SimpleCrowdfundingStatus",
    "asset_id": "AssetId",
    "total_amount": {
      "0": "AssetsBalanceOf"
    },
    "soft_cap": {
      "0": "AssetsBalanceOf"
    },
    "hard_cap": {
      "0": "AssetsBalanceOf"
    },
    "shares": "Vec<DeipAsset>"
  },
  "Investment": {
    "sale_id": "InvestmentId",
    "owner": "AccountId",
    "amount": "AssetsBalanceOf",
    "time": "Moment"
  },
  "FundingModel": {
    "_enum": {
      "SimpleCrowdfunding": {
        "start_time": "Moment",
        "end_time": "Moment",
        "soft_cap": "DeipAsset",
        "hard_cap": "DeipAsset"
      }
    }
  },
  "FundingModelOf": "FundingModel",
  "Balance": "u128",
  "AssetBalanceOf": "Balance",
  "AssetsBalanceOf": "AssetBalanceOf",
  "DeipAssetBalanceOf": "AssetsBalanceOf",
  "AssetBalance": {
    "balance": "AssetsBalanceOf",
    "is_frozen": "bool",
    "sufficient": "bool",
    "extra": {
    }
  },
  "TAssetBalance": "u128",
  "AssetMetadata": {
    "name": "Vec<u8>",
    "symbol": "Vec<u8>",
    "decimals": "u8"
  },
  "AssetDetails": {
    "owner": "AccountId",
    "issuer": "AccountId",
    "admin": "AccountId",
    "freezer": "AccountId",
    "supply": "AssetsBalanceOf",
    "deposit": "Balance",
    "min_balance": "AssetsBalanceOf",
    "is_sufficient": "bool",
    "accounts": "u32",
    "sufficients": "u32",
    "approvals": "u32",
    "is_frozen": "bool"
  },
  "DeipProjectIdOf": "H160",
  "AssetId": "u32",
  "AssetIdOf": "AssetId",
  "AssetsAssetIdOf": "AssetId",
  "DeipAssetIdOf": "H160",
  "HashOf": "Hash",
  "ContractAgreementId": "H160",
  "ContractAgreementTerms": {
    "_enum": {
      "LicenseAgreement": {
        "source": "ProjectId",
        "price": "DeipAsset"
      },
      "GeneralContractAgreement": {
      }
    }
  },
  "ContractAgreementTermsOf": "ContractAgreementTerms",
  "ContractAgreementIndexTerms": {
    "_enum": [
      "LicenseAgreement",
      "GeneralContractAgreement"
    ]
  },
  "License": {
    "id": "ContractAgreementId",
    "creator": "AccountId",
    "licenser": "AccountId",
    "licensee": "AccountId",
    "hash": "Hash",
    "activation_time": "Option<Moment>",
    "expiration_time": "Option<Moment>",
    "project_id": "ProjectId",
    "price": "DeipAsset"
  },
  "LicenseStatus": {
    "_enum": {
      "Unsigned": {
        "0": "License"
      },
      "SignedByLicenser": {
        "0": "License"
      },
      "Signed": {
        "0": "License"
      },
      "Rejected": {
        "0": "License"
      }
    }
  },
  "ContractAgreement": {
    "_enum": {
      "None": {
      },
      "License": {
        "0": "LicenseStatus"
      },
      "GeneralContract": {
        "0": "GeneralContractStatus"
      }
    }
  },
  "ContractAgreementOf": "ContractAgreement",
  "GeneralContract": {
    "id": "ContractAgreementId",
    "creator": "AccountId",
    "parties": "Vec<AccountId>",
    "hash": "Hash",
    "activation_time": "Option<Moment>",
    "expiration_time": "Option<Moment>"
  },
  "GeneralContractStatus": {
    "_enum": {
      "PartiallyAccepted": {
        "contract": "GeneralContract",
        "accepted_by": "Vec<AccountId>"
      },
      "Accepted": {
        "0": "GeneralContract"
      },
      "Rejected": {
        "0": "GeneralContract"
      }
    }
  },
  "VestingPlan": {
    "start_time": "u64",
    "cliff_duration": "u64",
    "total_duration": "u64",
    "interval": "u64",
    "initial_amount": "Balance",
    "total_amount": "Balance",
    "vesting_during_cliff": "bool"
  }
};


export default CHAIN_TYPES;