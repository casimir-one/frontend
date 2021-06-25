import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { PROTOCOL_OPERATIONS_MAP } from './../../constants';


const SUBSTRATE_OP_CMD_MAP = (chainNodeClient) => {

  return {

    [PROTOCOL_OPERATIONS_MAP.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare
    }) => {

      // TODO: Generate project id
      return chainNodeClient.tx.deip.createProject(
        teamId,
        description,
        domains,
        isPrivate,
        members,
        reviewShare,
        compensationShare
      );
    },


    [PROTOCOL_OPERATIONS_MAP.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    }) => {

      // TODO: Generate project id
      return chainNodeClient.tx.deip.createProposal(
        entityId,
        creator,
        proposedCmds,
        expirationTime,
        reviewPeriodSeconds,
        extensions
      );
    }

  }
}


class SubstrateChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient) {
    super(SUBSTRATE_OP_CMD_MAP(chainNodeClient));
  }
}


export default SubstrateChainOperationsRegistry;