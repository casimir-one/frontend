import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { assert } from '@deip/toolbox';
import { hexToU8a } from '@polkadot/util';
import { APP_CMD, CONTRACT_AGREEMENT_TYPE } from '@deip/constants';
import { daoIdToAddress, pubKeyToAddress, isAddress, isValidPubKey } from './utils';


const SUBSTRATE_OP_CMD_MAP = (chainNodeClient, {
  coreAsset
}) => {

  return {

    [APP_CMD.CREATE_ACCOUNT]: ({
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


    [APP_CMD.UPDATE_ACCOUNT]: ({
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

    [APP_CMD.ALTER_ACCOUNT_AUTHORITY]: ({
      entityId,
    }) => {

      // Add Operation !!!

      // const updateAccountOp = chainNodeClient.tx.deipDao.onBehalf(`0x${entityId}`,
      //   chainNodeClient.tx.deipDao.updateDao(
      //     /* "new_metadata": */ description ? `0x${description}` : null
      //   )
      // );

      return [];
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


    [APP_CMD.UPDATE_PROPOSAL]: ({
      entityId,
      activeApprovalsToAdd,
      activeApprovalsToRemove,
      ownerApprovalsToAdd,
      ownerApprovalsToRemove,
      keyApprovalsToAdd,
      keyApprovalsToRemove
    }) => {

      const approvers = [...(activeApprovalsToAdd || []), ...(ownerApprovalsToAdd || []), ...(keyApprovalsToAdd || [])].reduce((arr, approver) => {
        if (!arr.includes(approver))
          arr.push(approver);
        return arr;
      }, []);

      const rejectors = [...(activeApprovalsToRemove || []), ...(ownerApprovalsToRemove || []), ...(keyApprovalsToRemove || [])].reduce((arr, rejector) => {
        if (!arr.includes(rejector))
          arr.push(rejector);
        return arr;
      }, []);


      assert(approvers.length || rejectors.length, "Proposal can be either approved or rejected");

      const ops = [];
      for (let i = 0; i < approvers.length; i++) {
        const approver = approvers[i];
        const approveProposalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${approver}`,
          chainNodeClient.tx.deipProposal.decide(
           /* external_id: */ `0x${entityId}`,
           /* decision: */ 'Approve'
          )
        );
        ops.push(approveProposalOp);
      }

      for (let i = 0; i < rejectors.length; i++) {
        const rejector = rejectors[i];
        const rejectProposalOp = chainNodeClient.tx.deipDao.onBehalf(`0x${rejector}`,
          chainNodeClient.tx.deipProposal.decide(
            /* external_id: */ `0x${entityId}`,
            /* decision: */ 'Reject'
          )
        );
        ops.push(rejectProposalOp);
      }

      return ops;
    },


    [APP_CMD.CREATE_ASSET]: ({
      entityId,
      issuer,
      symbol,
      name,
      precision,
      maxSupply,
      minBalance,
      projectTokenOption
    }) => {

      const createAssetOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.deipAssets.createAsset(
          /* assetId: */ `0x${entityId}`,
          /* admin: */ { Dao: `0x${issuer}` },
          /* min_balance: */ minBalance,
          /* project_id: */ projectTokenOption ? `0x${projectTokenOption.projectId}` : null
        )
      );

      const setAssetMetaOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.deipAssets.setMetadata(
          /* assetId: */ `0x${entityId}`,
          /* name */ name,
          /* symbol */ symbol,
          /* decimals */ precision
        )
      );

      const setAssetTeamOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.deipAssets.setTeam(
          /* assetId: */ `0x${entityId}`,
          /* issuer */ { Dao: `0x${issuer}` },
          /* admin */ { Dao: `0x${issuer}` },
          /* freezer */ { Dao: `0x${issuer}` }
        )
      );

      return [createAssetOp, setAssetMetaOp, setAssetTeamOp];
    },


    [APP_CMD.ISSUE_ASSET]: ({
      issuer,
      asset,
      recipient,
      memo
    }) => {

      const issueAssetOp = chainNodeClient.tx.deipDao.onBehalf(`0x${issuer}`,
        chainNodeClient.tx.deipAssets.issueAsset(
          /* assetId: */ `0x${asset.id}`,
          /* beneficiary */ { Dao: `0x${recipient}` },
          /* amount */ asset.amount
        )
      );

      return [issueAssetOp];
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
          /* shares: */ shares.map((share) => ({ id: `0x${share.id}`, amount: { "0": share.amount } })),
          /* funding_model: */ {
            SimpleCrowdfunding: {
              start_time: startTime,
              end_time: endTime,
              soft_cap: { id: `0x${softCap.id}`, amount: { "0": softCap.amount } },
              hard_cap: { id: `0x${hardCap.id}`, amount: { "0": hardCap.amount } },
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
          /* amount: */ { id: `0x${asset.id}`, amount: { "0": asset.amount } },
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
          price: { id: `0x${terms.price.id}`, amount: { "0": terms.price.amount } }
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


    [APP_CMD.ASSET_TRANSFER]: ({
      from,
      to,
      asset,
      memo
    }) => {

      const toAddress = isValidPubKey(`0x${to}`) ? pubKeyToAddress(`0x${to}`) : daoIdToAddress(`0x${to}`, chainNodeClient.registry);
      
      if (asset.id == coreAsset.id) {
        const transferCoreAssetOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`,
          chainNodeClient.tx.balances.transfer(
            /* to: */ toAddress,
            /* amount: */ asset.amount
          )
        );
        return [transferCoreAssetOp];
      } else {
        const transferAssetOp = chainNodeClient.tx.deipDao.onBehalf(`0x${from}`, 
          chainNodeClient.tx.deipAssets.transfer(
            /* assetId: */ `0x${asset.id}`,
            /* to: */ { Native: toAddress },
            /* amount: */ asset.amount
          )
        );
        return [transferAssetOp];
      }

    }

  }
}


class SubstrateChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient, settings) {
    super(SUBSTRATE_OP_CMD_MAP(chainNodeClient, settings));
  }
}


export default SubstrateChainOperationsRegistry;
