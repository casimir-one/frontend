import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class DocumentTemplateHttp {
  http = HttpService.getInstance();

  async getDocumentTemplate(id) {
    return this.http.get(`/api/v2/document-template/${id}`);
  }

  async getDocumentTemplatesByAccount(account) {
    return this.http.get(`/api/v2/document-templates/account/${account}`);
  }

  async createDocumentTemplate(req) {
    return this.http.post('/api/v2/document-template', req.getHttpBody());
  }

  async updateDocumentTemplate(req) {
    return this.http.put('/api/v2/document-template', req.getHttpBody());
  }

  async deleteDocumentTemplate(req) {
    return this.http.put('/api/v2/document-template/delete', req.getHttpBody());
  }

  /** @type {() => DocumentTemplateHttp} */
  static getInstance = createInstanceGetter(DocumentTemplateHttp)
}
