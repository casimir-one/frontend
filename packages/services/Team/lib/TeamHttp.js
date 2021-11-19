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

  async joinTeam(req) {
    return this.http.post(
      '/api/v2/team/join',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async leaveTeam(req) {
    return this.http.post(
      '/api/v2/team/leave',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  async get(teamExternalId) {
    return this.http.get(`/api/v2/team/${teamExternalId}`);
  }

  async getList(teamsIds) {
    const query = serializeParams({ teamsIds });
    return this.http.get(`/api/v2/teams?${query}`);
  }

  async getListByUser(username, withTenantTeam) {
    const query = serializeParams({ withTenantTeam });
    return this.http.get(`/api/v2/teams/member/${username}?${query}`);
  }

  async getListing(withTenantTeam) {
    const query = serializeParams({ withTenantTeam });
    return this.http.get(`/api/v2/teams/listing?${query}`);
  }

  async getListByTenant(tenantId, withTenantTeam) {
    const query = serializeParams({ withTenantTeam });
    return this.http.get(`/api/v2/teams/tenant/${tenantId}?${query}`);
  }

  /** @type {() => TeamHttp} */
  static getInstance = createInstanceGetter(TeamHttp);
}
