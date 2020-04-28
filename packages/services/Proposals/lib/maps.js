import deipRpc from '@deip/rpc-client';
import { PROPOSAL_TYPES } from './constants';

const extenderMap = {
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: {
    research: (payload) => deipRpc.api.getResearchAsync(payload.research_external_id),
  },
  [PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: {
    research: (payload) => deipRpc.api.getResearchAsync(payload.research_external_id),
  }
};

export {
  extenderMap
};
