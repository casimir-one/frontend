import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ProjectHttp extends Singleton {
  http = HttpService.getInstance();

  createProject(request) {
    return this.http.post('/api/project', request.getRequestBody(), { headers: request.getRequestHeaders() });
  }
  
}

export {
  ProjectHttp
};
