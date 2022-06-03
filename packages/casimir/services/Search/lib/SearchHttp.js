import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

export class SearchHttp {
  http = HttpService.getInstance();

  /** @type {() => SearchHttp} */
  static getInstance = makeSingletonInstance(() => new SearchHttp());
}
