import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchGroupHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  sendCreateGroup(tx) {
    return this.http.post('/api/groups', tx);
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

  updateJoinRequest(update) {
    return this.http.put('/api/join-requests', update);
  }
}

export {
  ResearchGroupHttp
};
