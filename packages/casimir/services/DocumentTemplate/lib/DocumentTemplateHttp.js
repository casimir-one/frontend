import { HttpService } from '@casimir/http-service';
import { makeSingletonInstance } from '@casimir/toolbox';

export class DocumentTemplateHttp {
  http = HttpService.getInstance();

  /**
   * Get document template by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/document-template/${id}`);
  }

  /**
   * Get document template list by team or user account
   * @param {string} account
   * @returns {Promise<Object>}
   */
  async getListByAccount(account) {
    return this.http.get(`/api/v2/document-templates/account/${account}`);
  }

  /**
   * Create document template
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/document-template', req.getHttpBody());
  }

  /**
   * Update document template
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async update(req) {
    return this.http.put('/api/v2/document-template', req.getHttpBody());
  }

  /**
   * Delete document template
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async delete(req) {
    return this.http.put('/api/v2/document-template/delete', req.getHttpBody());
  }

  /** @type {() => DocumentTemplateHttp} */
  static getInstance = makeSingletonInstance(() => new DocumentTemplateHttp());
}
