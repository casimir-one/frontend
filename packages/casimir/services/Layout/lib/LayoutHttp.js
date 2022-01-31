import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class LayoutHttp {
  http = HttpService.getInstance();

  async getLayout(layoutId) {
    return this.http.get(`/api/v2/layout/${layoutId}`);
  }

  async getLayouts() {
    return this.http.get('/api/v2/layouts');
  }

  async getLayoutsByScope(scope) {
    return this.http.get(`/api/v2/layouts/scope/${scope}`);
  }

  async createLayout(req) {
    return this.http.post('/api/v2/layout', req.getHttpBody());
  }

  async updateLayout(req) {
    return this.http.put('/api/v2/layout', req.getHttpBody());
  }

  async deleteLayout(req) {
    return this.http.put('/api/v2/layout/delete', req.getHttpBody());
  }

  async getSettings() {
    return this.http.get('/portal/settings/layout-settings');
  }

  async updateLayouts(req) {
    return this.http.put('/portal/settings/layouts', req.getHttpBody());
  }

  async updateSettings(req) {
    return this.http.put('/portal/settings/layout-settings', req.getHttpBody());
  }

  /** @type {() => LayoutHttp} */
  static getInstance = createInstanceGetter(LayoutHttp);
}
