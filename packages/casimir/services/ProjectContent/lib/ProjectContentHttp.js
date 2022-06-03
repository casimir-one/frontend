import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Project content HTTP transport
 */
export class ProjectContentHttp {
  http = HttpService.getInstance();

  /**
   * Get project content draft by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getDraft(id) {
    return this.http.get(`/api/v2/project-content/draft/${id}`);
  }

  /**
   * @deprecated
   * Get project content onchain entity by id
   * @param {string} refId
   * @returns {Promise<Object>}
   */
  async getContentRef(refId) {
    return this.http.get(`/api/v2/project-content/ref/${refId}`);
  }

  /**
   * Get project content by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getContent(id) {
    return this.http.get(`/api/v2/project-content/${id}`);
  }

  /**
   * Get project content list by project
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getContentListByProject(projectId) {
    return this.http.get(`/api/v2/project-content/project/${projectId}`);
  }

  /**
   * Publish project content
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async publishContent(req) {
    return this.http.post('/api/v2/project-content/ref/publish',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Get project content draft list by project
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getDraftsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/drafts/project/${projectId}`);
  }

  /**
   * Get project content draft list paginated
   * @param {Object} query
   * @param {Object} query.sort 'asc', 'desc' by fields
   * @param {Number} query.page 0 or above
   * @param {Number} query.pageSize from 1 to 100
   * @param {Object} query.filter filter
   * @returns {Promise<Object>}
   */
  async getDraftsListPaginated(query) {
    const querySerialized = serializeParams(query);
    return this.http.get(`/api/v2/project-content/drafts-paginated?${querySerialized}`);
  }

  /**
   * Create project content draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createDraft(req) {
    return this.http.post('/api/v2/project-content/texture',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Update project content draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updateDraft(req) {
    return this.http.put('/api/v2/project-content/texture',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Delete project content draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async deleteDraft(req) {
    return this.http.put('/api/v2/project-content/draft/delete',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Unlock project content draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async unlockDraft(req) {
    return this.http.put('/api/v2/project-content/draft/unlock',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Get project content list by portal
   * @param {string} portalId
   * @returns {Promise<Object>}
   */
  async getContentListByPortal(portalId) {
    return this.http.get(`/api/v2/project-content/portal/${portalId}`);
  }

  /**
   * Get public project content list
   * @returns {Promise<Object>}
   */
  async getPublicContentList() {
    return this.http.get('/api/v2/project-content/listing');
  }

  /**
   * @param {Object} query
   * @param {Object} query.sort 'asc', 'desc' by fields
   * @param {Number} query.page 0 or above
   * @param {Number} query.pageSize from 1 to 100
   * @param {Object} query.filter
   */
  async getContentListPaginated(query) {
    const querySerialized = serializeParams(query);
    return this.http.get(`/api/v2/project-content/listing-paginated?${querySerialized}`);
  }

  /**
   * Get project content references graph
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getContentReferencesGraph(id) {
    return this.http.get(`/api/v2/project-content/ref/graph/${id}`);
  }

  /** @type {() => ProjectContentHttp} */
  static getInstance = makeSingletonInstance(() => new ProjectContentHttp());
}
