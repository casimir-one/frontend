import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentReviewsHttp extends Singleton {
  http = HttpService.getInstance();

  sendMakeReviewOp(tx) {
    return this.http.post('/api/reviews', tx);
  }
}

export {
  ResearchContentReviewsHttp
};
