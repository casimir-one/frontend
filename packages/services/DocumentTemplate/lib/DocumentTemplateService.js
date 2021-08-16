import { Singleton } from '@deip/toolbox';
import {
  CreateDocumentTemplateCmd,
  UpdateDocumentTemplateCmd,
  DeleteDocumentTemplateCmd
} from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { DocumentTemplateHttp } from './DocumentTemplateHttp';

class DocumentTemplateService extends Singleton {
  documentTemplateHttp = DocumentTemplateHttp.getInstance();

  getDocumentTemplate(id) {
    return this.documentTemplateHttp.getDocumentTemplate(id);
  }

  getDocumentTemplatesByAccount(account) {
    return this.documentTemplateHttp.getDocumentTemplatesByAccount(account);
  }

  createDocumentTemplate(documentTemplate) {
    const createDocumentTemplateCmd = new CreateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [createDocumentTemplateCmd] });
    return this.documentTemplateHttp.createDocumentTemplate(msg);
  }

  updateDocumentTemplate(documentTemplate) {
    const updateDocumentTemplateCmd = new UpdateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [updateDocumentTemplateCmd] });
    return this.documentTemplateHttp.updateDocumentTemplate(msg);
  }

  deleteDocumentTemplate(documentTemplateId) {
    const deleteDocumentTemplateCmd = new DeleteDocumentTemplateCmd({ documentTemplateId });
    const msg = new JsonDataMsg({ appCmds: [deleteDocumentTemplateCmd] });
    return this.documentTemplateHttp.deleteDocumentTemplate(msg);
  }
}

export {
  DocumentTemplateService
};
