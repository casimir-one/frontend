import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class LayoutHttp extends Singleton {
  http = HttpService.getInstance();

  getLayouts(tenantId) {
    return this.http.get(`/tenant/settings/layouts/${tenantId}`);
  }

  // temp solution, need change to msg

  updateLayouts(data) {
    return this.http.put('/tenant/settings/layouts', data);
  }
}

export {
  LayoutHttp
};
