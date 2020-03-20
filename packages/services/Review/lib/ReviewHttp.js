import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ReviewHttp extends Singleton {
  http = HttpService.getInstance();

}

export {
  ReviewHttp
};
