import {
  CreateDocumentTemplateCmd,
  UpdateDocumentTemplateCmd,
  DeleteDocumentTemplateCmd
} from '@deip/commands';
import { JsonDataMsg } from '@deip/messages';
import { createInstanceGetter } from '@deip/toolbox';
import { DocumentTemplateHttp } from './DocumentTemplateHttp';

export class DocumentTemplateService {
  documentTemplateHttp = DocumentTemplateHttp.getInstance();

  async getDocumentTemplate(id) {
    return this.documentTemplateHttp.getDocumentTemplate(id);
  }

  async getDocumentTemplatesByAccount(account) {
    return this.documentTemplateHttp.getDocumentTemplatesByAccount(account);
  }

  async createDocumentTemplate(documentTemplate) {
    const createDocumentTemplateCmd = new CreateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [createDocumentTemplateCmd] });
    return this.documentTemplateHttp.createDocumentTemplate(msg);
  }

  async updateDocumentTemplate(documentTemplate) {
    const updateDocumentTemplateCmd = new UpdateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [updateDocumentTemplateCmd] });
    return this.documentTemplateHttp.updateDocumentTemplate(msg);
  }

  async deleteDocumentTemplate(documentTemplateId) {
    const deleteDocumentTemplateCmd = new DeleteDocumentTemplateCmd({ documentTemplateId });
    const msg = new JsonDataMsg({ appCmds: [deleteDocumentTemplateCmd] });
    return this.documentTemplateHttp.deleteDocumentTemplate(msg);
  }

  /** @type {() => DocumentTemplateService} */
  static getInstance = createInstanceGetter(DocumentTemplateService);
}
