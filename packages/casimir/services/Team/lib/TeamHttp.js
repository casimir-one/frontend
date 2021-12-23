import { serializeParams, HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class TeamHttp {
  http = HttpService.getInstance();

  async create(req) {
    return this.http.post(
      '/api/v2/team',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async update(req) {
    return this.http.put(
      '/api/v2/team',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async addTeamMember(req) {
    return this.http.post(
      '/api/v2/team/join',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async removeTeamMember(req) {
    return this.http.post(
      '/api/v2/team/leave',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async get(teamId) {
    return this.http.get(`/api/v2/team/${teamId}`);
  }

  async getList(teamsIds) {
    const query = serializeParams({ teamsIds });
    return this.http.get(`/api/v2/teams?${query}`);
  }

  async getListByUser(username, withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/member/${username}?${query}`);
  }

  async getListing(withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/listing?${query}`);
  }

  async getListByPortal(portalId, withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/portal/${portalId}?${query}`);
  }

  /** @type {() => TeamHttp} */
  static getInstance = createInstanceGetter(TeamHttp);
}
