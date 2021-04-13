import { APP_CMD } from '@deip/command-models';
import BaseOperationsRegistry from './../base/BaseOperationsRegistry';

const POLKADOT_OPERATIONS_MAP = (api) => {
  return {

    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare
    }, txContext) => {

      // TODO: Generate project id
      return api.tx.deip.createProject(
        teamId,
        description,
        domains,
        isPrivate,
        members,
        reviewShare,
        compensationShare
      );
    },


    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    }, txContext) => {

      // TODO: Generate project id
      return api.tx.deip.createProposal(
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


class PolkadotOperationsRegistry extends BaseOperationsRegistry {
  constructor(api) {
    super(POLKADOT_OPERATIONS_MAP(api));
  }
}


export default PolkadotOperationsRegistry;