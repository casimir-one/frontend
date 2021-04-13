import { Singleton } from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';


class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;

  createProject(request) {
    return this.projectHttp.createProject(request);
  }
}


export {
  ProjectService
};