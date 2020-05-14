import deipRpc from '@deip/rpc-client';
import { PROPOSAL_TYPES } from './constants';
import { ProposalsHttp } from './ProposalsHttp';

const proposalsHttp = ProposalsHttp.getInstance();

const extenderMap = {
  [PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: {
    research: (payload) => deipRpc.api.getResearchAsync(payload.research_external_id),
  },
  [PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: {
    research: (payload) => deipRpc.api.getResearchAsync(payload.research_external_id),
  },
  [PROPOSAL_TYPES.INVITE_MEMBER]: {
    invitee: (payload) => Promise.all([
      deipRpc.api.getAccountsAsync([payload.member]),
      proposalsHttp.getUserProfile(payload.member)
    ])
      .then(([[account], [profile]]) => {
        return { account, profile };
      }),
  },
  [PROPOSAL_TYPES.EXCLUDE_MEMBER]: {
    member: (payload) => Promise.all([
      deipRpc.api.getAccountsAsync([payload.member]),
      proposalsHttp.getUserProfile(payload.member)
    ])
      .then(([[account], [profile]]) => {
        return { account, profile };
      }),
  }
};

export {
  extenderMap
};
