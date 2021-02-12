import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class SearchHttp extends Singleton {
  http = HttpService.getInstance();

}

export {
  SearchHttp
};
