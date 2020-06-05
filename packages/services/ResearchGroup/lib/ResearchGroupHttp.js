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

  getResearchGroup(researchGroupExternalId) {
    return this.http.get(`/api/groups/${researchGroupExternalId}`);
  }

  getActivityLogsEntriesByResearchGroup(researchGroupExternalId) {
    return this.http.get(`/api/groups/activity-log/${researchGroupExternalId}`);
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

  updateJoinRequest(update) {
    return this.http.put('/api/join-requests', update);
  }

  getResearchGroupPendingInvites(researchGroupExternalId) {
    return this.http.get(`/api/invites/group/${researchGroupExternalId}`);
  }

  createResearchGroupInvite({ tx, offchainMeta }) {
    return this.http.post('/api/invites', { tx, offchainMeta });
  }

  approveResearchGroupInvite({ tx }) {
    return this.http.post(`/api/invites/approve`, { tx });
  }

  rejectResearchGroupInvite({ tx }) {
    return this.http.post(`/api/invites/reject`, { tx });
  }

  leftResearchGroup({ tx, offchainMeta, isProposal}) {
    return this.http.post('/api/groups/left', { tx, offchainMeta, isProposal });
  }
}

export {
  ResearchGroupHttp
};
