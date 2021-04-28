import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ProjectHttp extends Singleton {
  http = HttpService.getInstance();

  createProject(req) {
    return this.http.post('/api/v2/project', req.getRequestBody(), { headers: req.getRequestHeaders() });
  }
  
}

export {
  ProjectHttp
};
