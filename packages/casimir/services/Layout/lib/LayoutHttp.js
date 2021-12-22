import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class LayoutHttp {
  http = HttpService.getInstance();

  async getLayouts() {
    return this.http.get('/tenant/settings/layouts');
  }

  async getSettings() {
    return this.http.get('/tenant/settings/layout-settings');
  }

  async updateLayouts(req) {
    return this.http.put('/tenant/settings/layouts', req.getHttpBody());
  }

  async updateSettings(req) {
    return this.http.put('/tenant/settings/layout-settings', req.getHttpBody());
  }

  /** @type {() => LayoutHttp} */
  static getInstance = createInstanceGetter(LayoutHttp);
}