import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class SearchHttp {
  http = HttpService.getInstance();

  /** @type {() => SearchHttp} */
  static getInstance = createInstanceGetter(SearchHttp);
}
