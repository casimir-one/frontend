import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class LayoutHttp extends Singleton {
  http = HttpService.getInstance();

  getLayouts() {
    return this.http.get('/tenant/settings/layouts');
  }

  getSettings() {
    return this.http.get('/tenant/settings/layout-settings');
  }

  updateLayouts(req) {
    return this.http.put('/tenant/settings/layouts', req.getHttpBody());
  }

  updateSettings(req) {
    return this.http.put('/tenant/settings/layout-settings', req.getHttpBody());
  }
}

export {
  LayoutHttp
};
