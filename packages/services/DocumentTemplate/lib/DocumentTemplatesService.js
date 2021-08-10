import { Singleton } from '@deip/toolbox';
import {
  CreateDocumentTemplateCmd,
  UpdateDocumentTemplateCmd,
  DeleteDocumentTemplateCmd
} from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { DocumentTemplatesHttp } from './DocumentTemplatesHttp';

class DocumentTemplatesService extends Singleton {
  documentTemplatesHttp = DocumentTemplatesHttp.getInstance();

  getDocumentTemplate(id) {
    return this.documentTemplatesHttp.getDocumentTemplate(id);
  }

  getDocumentTemplatesByAccount(account) {
    return this.documentTemplatesHttp.getDocumentTemplatesByAccount(account);
  }

  createDocumentTemplate(documentTemplate) {
    const createDocumentTemplateCmd = new CreateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [createDocumentTemplateCmd] });
    return this.documentTemplatesHttp.createDocumentTemplate(msg);
  }

  updateDocumentTemplate(documentTemplate) {
    const updateDocumentTemplateCmd = new UpdateDocumentTemplateCmd(documentTemplate);
    const msg = new JsonDataMsg({ appCmds: [updateDocumentTemplateCmd] });
    return this.documentTemplatesHttp.updateDocumentTemplate(msg);
  }

  deleteDocumentTemplate(documentTemplateId) {
    const deleteDocumentTemplateCmd = new DeleteDocumentTemplateCmd({ documentTemplateId });
    const msg = new JsonDataMsg({ appCmds: [deleteDocumentTemplateCmd] });
    return this.documentTemplatesHttp.deleteDocumentTemplate(msg);
  }
}

export {
  DocumentTemplatesService
};
