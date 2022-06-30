import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { assert } from '@deip/toolbox';
import { hexToU8a, stringToHex } from '@polkadot/util';
import { APP_CMD, CONTRACT_AGREEMENT_TYPE } from '@casimir/platform-core';
import { daoIdToAddress, pubKeyToAddress, getMultiAddress, toAddress, isAddress } from './utils';
import { pascalCase } from 'change-case';


const SUBSTRATE_OP_CMD_MAP = (chainNodeClient, {
  coreAsset
}) => {

  return {

    [APP_CMD.CREATE_DAO]: ({
      entityId,
      authority,
      description
    }) => {

      const signatories = authority.owner.auths.map((auth) => {
        return auth.name ? daoIdToAddress(`0x${auth.name}`, chainNodeClient.registry) : pubKeyToAddress(`0x${auth.key}`)
      });
      // Due to Substrate specifics, we have to set the weight to 0 for DAO with a single authority
      const threshold = authority.owner.weight === 1 && signatories.length === 1 ? 0 : authority.owner.weight;

      if (signatories.length > 1) {
        assert(threshold != 0 && threshold <= signatories.length, `Multisig DAO threshold must be more than 0 and can not be more than signatories count`);
      }

      const createAccountOp = chainNodeClient.tx.deipDao.create(
        /* dao_id: */ `0x${entityId}`,
        /* authority: */ {
          "signatories": signatories,
          "threshold": threshold
        },
        /* metadata: */ description ? `0x${description}` : null
      );

      return [createAccountOp];
    },


    [APP_CMD.UPDATE_DAO]: ({
      entityId,
      description
    }) => {

      const updateAccountOp = chainNodeClient.tx.deipDao.onBehalf(`0x${entityId}`,
        chainNodeClient.tx.deipDao.updateDao(
          /* "new_metadata": */ description ? `0x${description}` : null
        )
      );

      return [updateAccountOp];
    },

    [APP_CMD.ALTER_DAO_AUTHORITY]: ({
      entityId,
      authority
    }) => {

      const signatories = authority.owner.auths.map((auth) => {
        return auth.name ? daoIdToAddress(`0x${auth.name}`, chainNodeClient.registry) : pubKeyToAddress(`0x${auth.key}`)
      });
      // Due to Substrate specifics, we have to set the weight to 0 for DAO with a single authority
      const threshold = authority.owner.weight === 1 && signatories.length === 1 ? 0 : authority.owner.weight;

      if (signatories.length > 1) {
        assert(threshold != 0 && threshold <= signatories.length, `Multisig DAO threshold must be more than 0 and can not be more than signatories count`);
      }

      const authorityKey = signatories.length > 1 ? getMultiAddress(signatories, threshold) : signatories[0];

      const alterAuthOp = chainNodeClient.tx.deipDao.onBehalf(`0x${entityId}`,
        chainNodeClient.tx.deipDao.alterAuthority(
          /* "alteration_type": */ { 
          "ReplaceAuthority" : {
            "authority_key": authorityKey,
            "authority": {
              "signatories": signatories,
              "threshold": threshold
            }
          } 
        })
      );

      return [alterAuthOp];
    },


    [APP_CMD.ADD_DAO_MEMBER]: ({
      member,
      teamId,
      isThresholdPreserved
    }) => {

      const address = toAddress(member, chainNodeClient.registry);
      const alterAuthOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deipDao.alterAuthority(
          /* "alteration_type": */ { 
          "AddMember" : {
            "member": address,
            "preserve_threshold": isThresholdPreserved
          } 
        })
      );

      return [alterAuthOp];
    },


    [APP_CMD.REMOVE_DAO_MEMBER]: ({
      member,
      teamId,
      isThresholdPreserved
    }) => {

      const address = toAddress(member, chainNodeClient.registry);
      const alterAuthOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deipDao.alterAuthority(
          /* "alteration_type": */ { 
          "RemoveMember" : {
            "member": address,
            "preserve_threshold": isThresholdPreserved
          } 
        })
      );

      return [alterAuthOp];
    },


    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds
    }, { cmdToOps }) => {


      const calls = proposedCmds.reduce((arr, cmd) => {
        const ops = cmdToOps(cmd);
        for (let i = 0; i < ops.length; i++) {
          const op = ops[i];

          const isOnBehalf = op.method.meta.toHex() === chainNodeClient.tx.deipDao.onBehalf.meta.toHex();
          assert(isOnBehalf, `Proposal can include 'onBehalf' calls only and cannot include account initialization`);

          const daoId = op.method.args[0];
          const method = op.method.args[1];

          const call = chainNodeClient.registry.createType('Call', hexToU8a(method.toHex()), method.meta);
          const extrinsic = chainNodeClient.registry.createType('Extrinsic', call);

          arr.push({ call: extrinsic, account: { Dao: daoId.toHex() } });
        }

        return arr;
      }, []);

      const createProposalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${creator}`,
        chainNodeClient.tx.deipProposal.propose(
          /* batch: */ calls,
          /* external_id: */ `0x${entityId}`
        )
      );

      return [createProposalOp];
    },



    [APP_CMD.ACCEPT_PROPOSAL]: ({
      entityId,
      account,
      batchWeight
    }) => {

      const acceptProposalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${account}`,
        chainNodeClient.tx.deipProposal.decide(
           /* external_id: */ `0x${entityId}`,
           /* decision: */ 'Approve',
           /* batch_weight */ batchWeight
        )
      );

      return [acceptProposalOp];
    },


    [APP_CMD.DECLINE_PROPOSAL]: ({
      entityId,
      account,
      batchWeight
    }) => {

      const declineProposalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${account}`,
        chainNodeClient.tx.deipProposal.decide(
          /* external_id: */ `0x${entityId}`,
          /* decision: */ 'Reject',
          /* batch_weight */ batchWeight
        )
      );
      
      return [declineProposalOp];
    },



    [APP_CMD.CREATE_FT]: ({
      entityId,
      issuer,
      symbol,
      name,
      precision,
      maxSupply,
      minBalance,
      metadata
    }) => {

      const issuerAddress = toAddress(issuer, chainNodeClient.registry);

      const createFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.create(
          /* assetId: */ entityId,
          /* admin: */ issuerAddress,
          /* min_balance: */ minBalance || 1,
        )
      );

      const setAssetMetaOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.setMetadata(
          /* assetId: */ entityId,
          /* name */ name,
          /* symbol */ symbol,
          /* decimals */ precision
        )
      );

      const setAssetTeamOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.setTeam(
          /* assetId: */ entityId,
          /* issuer */ issuerAddress,
          /* admin */ issuerAddress,
          /* freezer */ issuerAddress
        )
      );

      return [createFungibleTokenOp, setAssetMetaOp, setAssetTeamOp];
    },


    [APP_CMD.CREATE_NFT_COLLECTION]: ({
      entityId,
      issuer,
      name,
      metadataHash
    }) => {

      const issuerAddress = toAddress(issuer, chainNodeClient.registry);

      const createNonFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.create(
          /* classId: */ entityId,
          /* admin: */ issuerAddress
        )
      );

      const setNonFungibleTokenTeamOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.setTeam(
          /* classId: */ entityId,
          /* issuer */ issuerAddress,
          /* admin */ issuerAddress,
          /* freezer */ issuerAddress
        )
      );

      return [createNonFungibleTokenOp, setNonFungibleTokenTeamOp];
    },


    [APP_CMD.ISSUE_FT]: ({
      issuer,
      tokenId,
      amount,
      recipient
    }) => {

      const recipientAddress = toAddress(recipient, chainNodeClient.registry);
      const issueFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.mint(
          /* assetId: */ tokenId,
          /* beneficiary */ recipientAddress,
          /* amount */ amount
        )
      );

      return [issueFungibleTokenOp];
    },


    [APP_CMD.CREATE_NFT_ITEM]: ({
      issuer,
      nftCollectionId,
      nftItemId,
      recipient
    }) => {

      const recipientAddress = toAddress(recipient, chainNodeClient.registry);
      const issueNonFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.mint(
          /* classId: */ nftCollectionId,
          /* instanceId: */ nftItemId,
          /* owner */ recipientAddress
        )
      );

      return [issueNonFungibleTokenOp];
    },


    [APP_CMD.CREATE_INVESTMENT_OPPORTUNITY]: ({
      entityId,
      teamId,
      startTime,
      endTime,
      shares,
      softCap,
      hardCap
    }) => {

      assert(softCap.id === hardCap.id, `Asset of 'softCap' and 'hardCap' should be the same`);

      const createInvestmentOpportunityOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.createInvestmentOpportunity(
          /* external_id: */ `0x${entityId}`,
          /* creator: */ { Dao: `0x${teamId}` },
          /* shares: */ shares.map((share) => ({ id: `0x${share.id}`, amount: share.amount })),
          /* funding_model: */ {
            SimpleCrowdfunding: {
              start_time: startTime,
              end_time: endTime,
              soft_cap: { id: `0x${softCap.id}`, amount: softCap.amount },
              hard_cap: { id: `0x${hardCap.id}`, amount: hardCap.amount },
            }
          }
        )
      );

      return [createInvestmentOpportunityOp];
    },


    [APP_CMD.INVEST]: ({
      investmentOpportunityId,
      investor,
      asset
    }) => {

      const investOp = chainNodeClient.tx.deipDao.onBehalf(`0x${investor}`,
        chainNodeClient.tx.deip.invest(
          /* investment_opportunity_id: */ `0x${investmentOpportunityId}`,
          /* amount: */ { id: `0x${asset.id}`, amount: asset.amount },
        )
      );

      return [investOp];
    },


    [APP_CMD.CREATE_CONTRACT_AGREEMENT]: ({
      entityId,
      creator,
      parties,
      hash,
      activationTime,
      expirationTime,
      type,
      terms
    }) => {

      const contractTerms = type === CONTRACT_AGREEMENT_TYPE.PROJECT_LICENSE ? {
        LicenseAgreement: {
          source: `0x${terms.projectId}`,
          price: { id: `0x${terms.price.id}`, amount: terms.price.amount }
        }
      } : {
        GeneralContractAgreement: {}
      };

      const createContractAgreementOp = chainNodeClient.tx.deipDao.onBehalf(`0x${creator}`,
        chainNodeClient.tx.deip.createContractAgreement(
          /* contractAgreementId: */ `0x${entityId}`,
          /* creator: */ { Dao: `0x${creator}` },
          /* parties: */ parties.map((party) => ({ Dao: `0x${party}` })),
          /* hash: */ `0x${hash}`,
          /* start_time: */ activationTime || null,
          /* end_time: */ expirationTime || null,
          /* terms: */ contractTerms
        )
      );

      return [createContractAgreementOp];
    },


    [APP_CMD.ACCEPT_CONTRACT_AGREEMENT]: ({
      entityId,
      party
    }) => {

      const acceptContractAgreementOp = chainNodeClient.tx.deipDao.onBehalf(`0x${party}`,
        chainNodeClient.tx.deip.acceptContractAgreement(
          /* contractAgreementId: */ `0x${entityId}`,
          /* party: */ { Dao: `0x${party}` }
        )
      );

      return [acceptContractAgreementOp];
    },


    [APP_CMD.REJECT_CONTRACT_AGREEMENT]: ({
      entityId,
      party
    }) => {

      const rejectContractAgreementOp = chainNodeClient.tx.deipDao.onBehalf(`0x${party}`,
        chainNodeClient.tx.deip.rejectContractAgreement(
          /* contractAgreementId: */ `0x${entityId}`,
          /* party: */ { Dao: `0x${party}` }
        )
      );

      return [rejectContractAgreementOp];
    },


    [APP_CMD.TRANSFER_FT]: ({
      from,
      to,
      tokenId,
      amount,
    }) => {
      const recipientAddress = toAddress(to, chainNodeClient.registry);

      if (tokenId == coreAsset.id) { // TODO: replace check with ASSET_TYPE.CORE
        const transferCoreAssetOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`,
          chainNodeClient.tx.balances.transfer(
            /* to: */ recipientAddress,
            /* amount: */ amount
          )
        );
        return [transferCoreAssetOp];
      } else {
        const transferFtOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`,
          chainNodeClient.tx.assets.transfer(
            /* assetId: */ tokenId,
            /* to: */ recipientAddress,
            /* amount: */ amount
          )
        );
        return [transferFtOp];
      }
    },


    [APP_CMD.TRANSFER_NFT]: ({
      from,
      to,
      nftCollectionId,
      nftItemId,
    }) => {
      const recipientAddress = toAddress(to, chainNodeClient.registry);

      const transferNftOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`,
        chainNodeClient.tx.uniques.transfer(
          /* assetId: */ nftCollectionId,
          /* instance: */ nftItemId,
          /* to: */ recipientAddress
        )
      );
      return [transferNftOp];
    },


    [APP_CMD.CREATE_PORTAL]: ({
      owner,
      verificationPubKey,
      metadata
    }) => {

      const address = toAddress(verificationPubKey, chainNodeClient.registry);
      const createPortalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${owner}`,
        chainNodeClient.tx.deipPortal.create(
          /* delegate: */ address,
          /* metadata: */ metadata ? `0x${metadata}` : null
        )
      );

      return [createPortalOp];
    }
    
  }

}

class SubstrateChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient, settings) {
    super(SUBSTRATE_OP_CMD_MAP(chainNodeClient, settings));
  }
}


export default SubstrateChainOperationsRegistry;
