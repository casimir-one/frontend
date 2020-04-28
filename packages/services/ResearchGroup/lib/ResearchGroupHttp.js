import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchGroupHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  createResearchGroup({ tx, offchainMeta }) {
    return this.http.post('/api/groups', { tx, offchainMeta });
  }

  updateResearchGroup({ tx, offchainMeta, isProposal}) {
    return this.http.put('/api/groups', { tx, offchainMeta, isProposal });
  }

  getActivityLogsEntriesByResearchGroup(researchGroupId) {
    return this.http.get(`/api/groups/activity-log/${researchGroupId}`);
  }

  getJoinRequestsByGroup(groupId) {
    return this.http.get(`/api/join-requests/group/${groupId}`);
  }

  getJoinRequestsByUser(username) {
    return this.http.get(`/api/join-requests/user/${username}`);
  }

  createJoinRequest(data) {
    return this.http.post('/api/join-requests', data);
  }

  createResearchGroupInvite({ tx, offchainMeta, isProposal}) {
    return this.http.post('/api/groups/invite', { tx, offchainMeta, isProposal });
  }

  leftResearchGroup({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/groups/left', { tx, offchainMeta, isProposal });
  }

  updateJoinRequest(update) {
    return this.http.put('/api/join-requests', update);
  }
}

export {
  ResearchGroupHttp
};
