import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Project HTTP transport
 */
export class ProjectHttp {
  http = HttpService.getInstance();

  /**
   * Get project by id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getOne(projectId) {
    return this.http.get(`/api/v2/project/${projectId}`);
  }

  /**
   * Get project list by ids
   * @param {Array.<string>} projectsIds
   * @returns {Promise<Object>}
   */
  async getListByIds(projectsIds) {
    const query = serializeParams({ projectsIds });
    return this.http.get(`/api/v2/projects?${query}`);
  }

  /**
   * Get team default project
   * @param {string} teamId
   * @returns {Promise<Object>}
   */
  async getTeamDefaultProject(teamId) {
    return this.http.get(`/api/v2/project/default/${teamId}`);
  }

  /**
   * Create project
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Update project
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async update(req) {
    return this.http.put('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Delete project
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async delete(req) {
    return this.http.put(
      '/api/v2/project/delete',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Get public projects
   * @param {Object} filter
   * @param {string} filter.searchTerm
   * @param {Array.<string>} filter.domains
   * @param {Array.<string>} filter.organizations
   * @param {Array} filter.projectAttributes
   * @param {Array.<string>} filter.projectAttributes
   * @returns {Promise<Object>}
   */
  async getPublicProjectList(filter) {
    const query = serializeParams({ filter });
    return this.http.get(`/api/v2/projects/listing?${query}`);
  }

  /**
   * Get projects where user is member
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getUserProjectList(username) {
    return this.http.get(`/api/v2/projects/user/listing/${username}`);
  }

  /**
   * Get projects for team
   * @param {string} teamId
   * @returns {Promise<Object>}
   */
  async getTeamProjectList(teamId) {
    return this.http.get(`/api/v2/projects/team/listing/${teamId}`);
  }

  /**
   * Get projects for portal
   * @returns {Promise<Object>}
   */
  async getPortalProjectList() {
    return this.http.get('/api/v2/projects/portal/listing');
  }

  /** @type {() => ProjectHttp} */
  static getInstance = makeSingletonInstance(() => new ProjectHttp());
}
