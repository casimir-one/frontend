import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { assert } from '@deip/toolbox';
import { hexToU8a, stringToHex } from '@polkadot/util';
import { APP_CMD, ASSET_TYPE, CONTRACT_AGREEMENT_TYPE, PROJECT_CONTENT_TYPES } from '@deip/constants';
import { daoIdToAddress, pubKeyToAddress, getMultiAddress, toAddress } from './utils';
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


    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate
    }) => {

      const createProjectOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.createProject(
          /* "is_private": */ isPrivate,
          /* "external_id": */ `0x${entityId}`,
          /* "team_id": */ { Dao: `0x${teamId}` },
          /* "description": */ `0x${description}`,
          /* "domains": */ domains.map((domain) => `0x${domain}`)
        )
      );

      return [createProjectOp];
    },


    [APP_CMD.UPDATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      isPrivate
    }) => {

      const updateProjectOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.updateProject(
          /* "project_id": */ `0x${entityId}`,
          /* "description": */ description ? `0x${description}` : null,
          /* "is_private": */ isPrivate != undefined ? isPrivate : null
        )
      );

      return [updateProjectOp];
    },


    [APP_CMD.CREATE_PROJECT_CONTENT]: ({
      entityId,
      projectId,
      teamId,
      type,
      description,
      content,
      authors,
      references
    }) => {

      const contentType = PROJECT_CONTENT_TYPES[type];
      const projectContentType = contentType ? pascalCase(contentType) : "Announcement";

      const createProjectContentOp = chainNodeClient.tx.deipDao.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.createProjectContent(
          /* "project_content_id": */ `0x${entityId}`,
          /* "project_id": */ `0x${projectId}`,
          /* "team_id": */ { Dao: `0x${teamId}` },
          /* "content_type": */ projectContentType,
          /* "description": */ `0x${description}`,
          /* "content": */ `0x${content}`,
          /* "authors": */ authors.map((author) => ({ Dao: `0x${author}` })),
          /* "references": */ references.map((contentId) => `0x${contentId}`),
        )
      );
      return [createProjectContentOp];
    },


    [APP_CMD.CREATE_REVIEW]: ({
      entityId,
      author,
      projectContentId,
      contentHash,
      assessment,
      domains
    }) => {

      const { scores, type, isPositive } = assessment;
      const model = type == 1 ? {
        scores
      } : {
        isPositive
      };
    
      const createReviewOp = chainNodeClient.tx.deipDao.onBehalf(`0x${author}`,
        chainNodeClient.tx.deip.createReview(
          /* "review_id": */ `0x${entityId}`,
          /* "author": */ { Dao: `0x${author}` },
          /* "content": */ `0x${contentHash}`,
          /* "domains": */ domains.map((domainId) => `0x${domainId}`),
          /* "assessmentModel": */ type,
          /* "weight": */ stringToHex(JSON.stringify(model)),
          /* "project_content_id": */ `0x${projectContentId}`,
        )
      );

      return [createReviewOp];
    },


    [APP_CMD.UPVOTE_REVIEW]: ({
      voter,
      reviewId,
      domainId
    }) => {
    
      const upvoteReviewOp = chainNodeClient.tx.deipDao.onBehalf(`0x${voter}`,
        chainNodeClient.tx.deip.upvoteReview(
          /* "review_id": */ `0x${reviewId}`,
          /* "domain_id": */ `0x${domainId}`
        )
      );

      return [upvoteReviewOp];
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
      projectTokenSettings
    }) => {

      const createFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.deipCreateAsset(
          /* assetId: */ `0x${entityId}`,
          /* admin: */ { Dao: `0x${issuer}` },
          /* min_balance: */ minBalance || 1,
          /* project_id */ projectTokenSettings ? `0x${projectTokenSettings.projectId}` : null
        )
      );

      const setAssetMetaOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.deipSetMetadata(
          /* assetId: */ `0x${entityId}`,
          /* name */ name,
          /* symbol */ symbol,
          /* decimals */ precision
        )
      );

      const setAssetTeamOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.deipSetTeam(
          /* assetId: */ `0x${entityId}`,
          /* issuer */ { Dao: `0x${issuer}` },
          /* admin */ { Dao: `0x${issuer}` },
          /* freezer */ { Dao: `0x${issuer}` }
        )
      );

      return [createFungibleTokenOp, setAssetMetaOp, setAssetTeamOp];
    },


    [APP_CMD.CREATE_NFT]: ({
      entityId,
      issuer,
      symbol,
      name,
      projectTokenSettings
    }) => {

      const createNonFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.deipCreate(
          /* classId: */ `0x${entityId}`,
          /* admin: */ { Dao: `0x${issuer}` },
          /* project_id: */ projectTokenSettings ? `0x${projectTokenSettings.projectId}` : null
        )
      );

      const setNonFungibleTokenMetaOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.deipSetClassMetadata(
          /* classId: */ `0x${entityId}`,
          /* data */ stringToHex(JSON.stringify({ symbol })),
          /* is_frozen */ false
        )
      );

      const setNonFungibleTokenTeamOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.deipSetTeam(
          /* classId: */ `0x${entityId}`,
          /* issuer */ { Dao: `0x${issuer}` },
          /* admin */ { Dao: `0x${issuer}` },
          /* freezer */ { Dao: `0x${issuer}` }
        )
      );

      return [createNonFungibleTokenOp, setNonFungibleTokenMetaOp, setNonFungibleTokenTeamOp];
    },


    [APP_CMD.ISSUE_FT]: ({
      issuer,
      tokenId,
      symbol,
      precision,
      amount,
      recipient
    }) => {

      const issueFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.assets.deipIssueAsset(
          /* assetId: */ `0x${tokenId}`,
          /* beneficiary */ { Dao: `0x${recipient}` },
          /* amount */ amount
        )
      );

      return [issueFungibleTokenOp];
    },


    [APP_CMD.ISSUE_NFT]: ({
      issuer,
      classId,
      instanceId,
      recipient
    }) => {

      const issueNonFungibleTokenOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.uniques.deipMint(
          /* classId: */ `0x${classId}`,
          /* instanceId: */ instanceId,
          /* owner */ { Dao: `0x${recipient}` }
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

    // TODO: Split this command to separate TransferFungibleToken and TransferNonFungibleToken
    [APP_CMD.TRANSFER_ASSET]: ({
      from,
      to,
      assetType,

      // FT
      tokenId,
      symbol,
      precision,
      amount,

      // NFT
      classId,
      instanceId,
    }) => {

      const recipientAddress = toAddress(to, chainNodeClient.registry);

      if (assetType === ASSET_TYPE.NFT) {
        const transferNftOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`,
          chainNodeClient.tx.uniques.deipTransfer(
            /* assetId: */ `0x${classId}`,
            /* instance: */ instanceId,
            /* to: */ { Native: recipientAddress }
          )
        );
        return [transferNftOp];
      } else { // ASSET_TYPE.FT
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
            chainNodeClient.tx.assets.deipTransfer(
              /* assetId: */ `0x${tokenId}`,
              /* to: */ { Native: recipientAddress },
              /* amount: */ amount
            )
          );
          return [transferFtOp];
        }
      }
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
