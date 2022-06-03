import { serializeParams, HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

export class TeamHttp {
  http = HttpService.getInstance();

  /**
   * Create new team
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async create(req) {
    return this.http.post(
      '/api/v2/team',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Update team
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async update(req) {
    return this.http.put(
      '/api/v2/team',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Add user to team
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async addTeamMember(req) {
    return this.http.post(
      '/api/v2/team/join',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Remove user from team
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async removeTeamMember(req) {
    return this.http.post(
      '/api/v2/team/leave',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Get team by team id
   * @param {string} teamId
   * @return {Promise<Object>}
   */
  async getOne(teamId) {
    return this.http.get(`/api/v2/team/${teamId}`);
  }

  /**
   * Get teams by ids
   * @param {string[]} teamsIds
   * @return {Promise<Object>}
   */
  async getListByIds(teamsIds) {
    const query = serializeParams({ teamsIds });
    return this.http.get(`/api/v2/teams?${query}`);
  }

  /**
   * Get teams by username
   * @param {string} username
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getListByUser(username, withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/member/${username}?${query}`);
  }

  /**
   * Get list of teams
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getList(withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/listing?${query}`);
  }

  /**
   * Get list of teams by portal id
   * @param {string} portalId
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getListByPortal(portalId, withPortalTeam) {
    const query = serializeParams({ withPortalTeam });
    return this.http.get(`/api/v2/teams/portal/${portalId}?${query}`);
  }

  /** @type {() => TeamHttp} */
  static getInstance = makeSingletonInstance(() => new TeamHttp());
}
