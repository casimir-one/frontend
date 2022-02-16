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

  async getOne(id) {
    return this.documentTemplateHttp.getOne(id);
  }

  async getListByAccount(account) {
    return this.documentTemplateHttp.getListByAccount(account);
  }

  async create(payload) {
    const createDocumentTemplateCmd = new CreateDocumentTemplateCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [createDocumentTemplateCmd] });
    return this.documentTemplateHttp.create(msg);
  }

  async update(payload) {
    const updateDocumentTemplateCmd = new UpdateDocumentTemplateCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateDocumentTemplateCmd] });
    return this.documentTemplateHttp.update(msg);
  }

  async delete(id) {
    const deleteDocumentTemplateCmd = new DeleteDocumentTemplateCmd({ documentTemplateId: id });
    const msg = new JsonDataMsg({ appCmds: [deleteDocumentTemplateCmd] });
    return this.documentTemplateHttp.delete(msg);
  }

  /** @type {() => DocumentTemplateService} */
  static getInstance = createInstanceGetter(DocumentTemplateService);
}
