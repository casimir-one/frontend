import BaseOperationsRegistry from './../../base/BaseOperationsRegistry';
import { PROTOCOL_OPERATIONS_MAP } from './../../constants';


const SUBSTRATE_OP_CMD_MAP = (chainNodeClient) => {

  return {

    [PROTOCOL_OPERATIONS_MAP.CREATE_PROJECT]: ({
      entityId,
      teamId,
      description,
      domains,
      isPrivate
    }) => {

      const createProjectOp = chainNodeClient.tx.deip.createProject({
        "is_private": isPrivate,
        "external_id": `0x${entityId}`,
        "team_id": teamId,
        "description": `0x${description}`,
        "domains": domains.map((domain) => `0x${domain}`),
        "members": [] // deprecated
      });

      return createProjectOp;
    }

  }
}


class SubstrateChainOperationsRegistry extends BaseOperationsRegistry {
  constructor(chainNodeClient) {
    super(SUBSTRATE_OP_CMD_MAP(chainNodeClient));
  }
}


export default SubstrateChainOperationsRegistry;