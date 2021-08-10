import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class DocumentTemplatesHttp extends Singleton {
  http = HttpService.getInstance();

  getDocumentTemplate(id) {
    return this.http.get(`/api/v2/document-template/${id}`);
  }

  getDocumentTemplatesByAccount(account) {
    return this.http.get(`/api/v2/document-templates/account/${account}`);
  }

  createDocumentTemplate(req) {
    return this.http.post('/api/v2/document-template', req.getHttpBody());
  }

  updateDocumentTemplate(req) {
    return this.http.put('/api/v2/document-template', req.getHttpBody());
  }

  deleteDocumentTemplate(req) {
    return this.http.put('/api/v2/document-template/delete', req.getHttpBody());
  }
}

export {
  DocumentTemplatesHttp
};
