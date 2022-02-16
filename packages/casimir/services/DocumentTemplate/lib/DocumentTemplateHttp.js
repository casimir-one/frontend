import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class DocumentTemplateHttp {
  http = HttpService.getInstance();

  async getOne(id) {
    return this.http.get(`/api/v2/document-template/${id}`);
  }

  async getListByAccount(account) {
    return this.http.get(`/api/v2/document-templates/account/${account}`);
  }

  async create(req) {
    return this.http.post('/api/v2/document-template', req.getHttpBody());
  }

  async update(req) {
    return this.http.put('/api/v2/document-template', req.getHttpBody());
  }

  async delete(req) {
    return this.http.put('/api/v2/document-template/delete', req.getHttpBody());
  }

  /** @type {() => DocumentTemplateHttp} */
  static getInstance = createInstanceGetter(DocumentTemplateHttp)
}
