import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class LayoutHttp extends Singleton {
  http = HttpService.getInstance();

  getLayouts() {
    return this.http.get('/tenant/settings/layouts');
  }

  // temp solution, need change to msg

  updateLayouts(data) {
    return this.http.put('/tenant/settings/layouts', data);
  }
}

export {
  LayoutHttp
};
