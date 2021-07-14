import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { assert } from '@deip/toolbox';
import { hexToU8a } from '@polkadot/util';
import { PROTOCOL_OPERATIONS_MAP } from '@deip/constants';

const SUBSTRATE_OP_CMD_MAP = (chainNodeClient) => {

  return {

    [PROTOCOL_OPERATIONS_MAP.CREATE_ACCOUNT]: ({
      entityId,
      isTeamAccount,
      fee,
      creator,
      description,
      authority,
    }) => {

      const signatories = authority.active.auths.map(auth => auth.key);
      const threshold = authority.active.weight;
      
      if (!isTeamAccount) {
        assert(signatories.length === 1 && threshold === 0, `Personal DAO must have a threshold equal to 0 with a single signatory`);
      } else {
        assert(signatories.length > 1 && threshold === 1, `Multisig DAO with the threshold that is more than 1 is not supported currently`);
      }

      const createAccountOp = chainNodeClient.tx.deipOrg.create(
        /* dao_id: */ `0x${entityId}`,
        /* key_source: */ {
          "signatories": signatories,
          "threshold": threshold
        }
      );

      if (!isTeamAccount) {
        return createAccountOp;
      } else {
        return chainNodeClient.tx.deipOrg.onBehalf(`0x${creator}`,
          chainNodeClient.tx.multisig.asMultiThreshold1([signatories[1]], createAccountOp)
        );
      }
    },


    [PROTOCOL_OPERATIONS_MAP.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate
    }) => {

      const createProjectOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.createProject(
          /* "is_private": */ isPrivate,
          /* "external_id": */ `0x${entityId}`,
          /* "team_id": */ { Org: teamId },
          /* "description": */ `0x${description}`,
          /* "domains": */ domains.map((domain) => `0x${domain}`)
        )
      );

      return createProjectOp;
    },


    [PROTOCOL_OPERATIONS_MAP.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds
    }, { cmdToOp }) => {


      const ops = proposedCmds.map((cmd) => {
        const op = cmdToOp(cmd);
        const isOnBehalf = op.method.meta === chainNodeClient.tx.deipOrg.onBehalf.meta;
        assert(isOnBehalf, 'Proposal can include onBehalf calls only');

        const daoId = op.method.args[0];
        const method = op.method.args[1];

        const call = chainNodeClient.registry.createType('Call', hexToU8a(method.toHex()), method.meta);
        const extrinsic = chainNodeClient.registry.createType('Extrinsic', call);

        return {
          call: extrinsic,
          account: { Org: daoId.toHex() }
        }
      });

      const createProposalOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${creator}`,
        chainNodeClient.tx.deipProposal.propose(
          /* batch: */ ops,
          /* external_id: */ `0x${entityId}`
        )
      );

      return createProposalOp;
    },


    [PROTOCOL_OPERATIONS_MAP.UPDATE_PROPOSAL]: ({
      entityId,
      activeApprovalsToAdd,
      activeApprovalsToRemove,
      ownerApprovalsToAdd,
      ownerApprovalsToRemove,
      keyApprovalsToAdd,
      keyApprovalsToRemove
    }) => {

      const approver = activeApprovalsToAdd && activeApprovalsToAdd.length ? activeApprovalsToAdd[0] : null;
      const rejector = activeApprovalsToRemove && activeApprovalsToRemove.length ? activeApprovalsToRemove[0] : null;

      assert(approver || rejector, "Proposal can be either approved or rejected");

      if (approver) {
        const approveProposalOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${approver}`,
          chainNodeClient.tx.deipProposal.decide(
           /* external_id: */ `0x${entityId}`, 
           /* decision: */ 'Approve'
          )
        );
        return approveProposalOp;
      } else {
        const rejectProposalOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${rejector}`,
          chainNodeClient.tx.deipProposal.decide(
            /* external_id: */ `0x${entityId}`,
            /* decision: */ 'Reject'
          )
        );
        return rejectProposalOp;
      }
    },

  }
}


class SubstrateChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient) {
    super(SUBSTRATE_OP_CMD_MAP(chainNodeClient));
  }
}


export default SubstrateChainOperationsRegistry;
