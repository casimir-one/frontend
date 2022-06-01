import {
  CreateDocumentTemplateCmd,
  UpdateDocumentTemplateCmd,
  DeleteDocumentTemplateCmd
} from '@deip/commands';
import { JsonDataMsg } from '@deip/messages';
import { createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { DocumentTemplateHttp } from './DocumentTemplateHttp';

export class DocumentTemplateService {
  documentTemplateHttp = DocumentTemplateHttp.getInstance();
  proxydi = proxydi;

  /**
   * Get document template by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.documentTemplateHttp.getOne(id);
  }

  /**
   * Get document template list by user or team account
   * @param {string} account
   * @returns {Promise<Object>}
   */
  async getListByAccount(account) {
    return this.documentTemplateHttp.getListByAccount(account);
  }

  /**
   * Create document template
   * @param {Object} payload
   * @param {string} payload.account
   * @param {string} payload.title
   * @param {Object} payload.body
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const createDocumentTemplateCmd = new CreateDocumentTemplateCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [createDocumentTemplateCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.documentTemplateHttp.create(msg);
  }

  /**
   * Update document template
   * @param {Object} payload
   * @param {string} payload._id
   * @param {string} payload.title
   * @param {Object} payload.body
   * @returns {Promise<Object>}
   */
  async update(payload) {
    const updateDocumentTemplateCmd = new UpdateDocumentTemplateCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateDocumentTemplateCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.documentTemplateHttp.update(msg);
  }

  /**
   * Delete document template
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const deleteDocumentTemplateCmd = new DeleteDocumentTemplateCmd({ documentTemplateId: id });
    const msg = new JsonDataMsg({ appCmds: [deleteDocumentTemplateCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.documentTemplateHttp.delete(msg);
  }

  /** @type {() => DocumentTemplateService} */
  static getInstance = createInstanceGetter(DocumentTemplateService);
}
