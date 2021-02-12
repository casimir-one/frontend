import { Singleton } from '@deip/toolbox';
import { SearchHttp } from './SearchHttp';

class SearchService extends Singleton {
  searchHttp = SearchHttp.getInstance();
}

export {
  SearchService
};
