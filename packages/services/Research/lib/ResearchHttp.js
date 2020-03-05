import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchHttp extends Singleton {
  http = HttpService.getInstance();

  getResearch(researchId) {
    return this.http.get(`/api/research/${researchId}`);
  }

  updateResearch(researchId, update) {
    return this.http.put(`/api/research/${researchId}`, update);
  }
}

export {
  ResearchHttp
};
