import deipRpc from '@deip/rpc-client';
import { UsersService } from '@deip/users-service';
import { ResearchContentService } from '@deip/research-content-service';
import { PROPOSAL_TYPES } from './constants';

const researchContentService = ResearchContentService.getInstance();
const usersService = UsersService.getInstance();

const extenderMap = {
  [PROPOSAL_TYPES.START_RESEARCH]: undefined,

  [PROPOSAL_TYPES.INVITE_MEMBER]: undefined,

  [PROPOSAL_TYPES.SEND_FUNDS]: {
    recipient: (proposal) => usersService
      .getEnrichedProfiles([proposal.data.recipient])
      .then((data) => data[0])
  },

  [PROPOSAL_TYPES.START_RESEARCH_TOKEN_SALE]: undefined,

  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: {
    research: (proposal) => deipRpc.api.getResearchByIdAsync(proposal.data.research_id),
    draftContent: (proposal) => /* refact */ researchContentService.getContentRefByHash(proposal.data.research_id, proposal.data.content.split(':')[1])
  }
};

export {
  extenderMap
};
