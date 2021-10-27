import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class TeamHttp extends Singleton {
  http = HttpService.getInstance();

  createTeam(req) {
    return this.http.post('/api/v2/team', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  updateTeam(req) {
    return this.http.put('/api/v2/team', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  joinTeam(req) {
    return this.http.post('/api/v2/team/join', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  leaveTeam(req) {
    return this.http.post('/api/v2/team/leave', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  getTeam(teamExternalId) {
    return this.http.get(`/api/v2/team/${teamExternalId}`);
  }

  getTeams(teamsIds) {
    const query = qs.stringify({ teamsIds });
    return this.http.get(`/api/v2/teams?${query}`);
  }

  getTeamsByUser(username, withTenantTeam) {
    const query = qs.stringify({ withTenantTeam });
    return this.http.get(`/api/v2/teams/member/${username}?${query}`);
  }

  getTeamsListing(withTenantTeam) {
    const query = qs.stringify({ withTenantTeam });
    return this.http.get(`/api/v2/teams/listing?${query}`);
  }

  getTeamsByTenant(tenantId, withTenantTeam) {
    const query = qs.stringify({ withTenantTeam });
    return this.http.get(`/api/v2/teams/tenant/${tenantId}?${query}`);
  }
}

export {
  TeamHttp
};
