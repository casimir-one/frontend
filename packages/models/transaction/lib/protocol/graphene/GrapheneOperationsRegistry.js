import { APP_CMD } from '@deip/command-models';
import BaseOperationsRegistry from './../base/BaseOperationsRegistry';

const GRAPHENE_OPERATIONS_MAP = (api) => {
  return {

    [APP_CMD.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare,
      extensions
    }, txContext) => {

      const op = ['create_research', {
        external_id: entityId,
        research_group: teamId,
        description: description,
        disciplines: domains,
        is_private: isPrivate || false,
        members: members,
        review_share: reviewShare || undefined,
        compensation_share: compensationShare || undefined,
        extensions: extensions || []
      }];

      const [projectId, createResearchOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createResearchOp;
    },

    [APP_CMD.CREATE_PROPOSAL]: ({
      entityId,
      creator,
      proposedCmds,
      expirationTime,
      reviewPeriodSeconds,
      extensions
    }, txContext) => {

      const op = ['create_proposal', {
        external_id: entityId,
        creator: creator,
        proposed_ops: proposedCmds.map((cmd) => ({ op: cmd.getProtocolOp() })),
        expiration_time: expirationTime,
        review_period_seconds: reviewPeriodSeconds,
        extensions: extensions
      }];

      const [proposalId, createProposalOp] = entityId
        ? [entityId, op]
        : api.operations.createEntityOperation(op, txContext);

      return createProposalOp;
    }
  }
}

class GrapheneOperationsRegistry extends BaseOperationsRegistry {
  constructor(api) {
    super(GRAPHENE_OPERATIONS_MAP(api));
  }
}


export default GrapheneOperationsRegistry;