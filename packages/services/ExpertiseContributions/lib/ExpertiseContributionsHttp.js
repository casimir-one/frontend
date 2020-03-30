import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ExpertiseContributionsHttp extends Singleton {
  http = HttpService.getInstance();
}

export {
  ExpertiseContributionsHttp
};
