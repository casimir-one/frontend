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

  // temp solution, need change to msg

  updateLayouts(data) {
    return this.http.put('/tenant/settings/layouts', data);
  }

  updateSettings(data) {
    return this.http.put('/tenant/settings/layout-settings', data);
  }
}

export {
  LayoutHttp
};
