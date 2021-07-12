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
      memoKey,
    }) => {

      const signatories = authority.active.auths.map(auth => auth.key);
      const threshold = authority.active.weight;
      const createAccountOp = chainNodeClient.tx.deipOrg.create(
        `0x${entityId}`, // name
        {
          "signatories": signatories, // key_source
          "threshold": threshold
        }
      );

      return createAccountOp;
    },


    [PROTOCOL_OPERATIONS_MAP.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate
    }) => {

      const createProjectOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${teamId}`,
        chainNodeClient.tx.deip.createProject({
          "is_private": isPrivate,
          "external_id": `0x${entityId}`,
          "team_id": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // temp, replace with teamId
          "description": `0x${description}`,
          "domains": domains.map((domain) => `0x${domain}`),
          "members": [] // deprecated
        })
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

        const daoId = op.method.args[0].toHex();
        const method = op.method.args[1];

        const call = chainNodeClient.registry.createType('Call', hexToU8a(method.toHex()), method.meta);
        const extrinsic = chainNodeClient.registry.createType('Extrinsic', call);

        return {
          call: extrinsic,
          account: { Org: daoId }
        }
      });

      const createProposalOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${creator}`,
        chainNodeClient.tx.deipOrgProposal.propose(ops, `0x${entityId}`),
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
          chainNodeClient.tx.deipProposal.decide(`0x${entityId}`, 'Approve')
        );
        return approveProposalOp;
      } else {
        const rejectProposalOp = chainNodeClient.tx.deipOrg.onBehalf(`0x${rejector}`,
          chainNodeClient.tx.deipProposal.decide(`0x${entityId}`, 'Reject')
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
