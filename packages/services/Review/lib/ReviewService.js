import { Singleton } from '@deip/toolbox';
import { ReviewHttp } from './ReviewHttp';

class ReviewService extends Singleton {
  reviewHttp = ReviewHttp.getInstance();

  getReviewRequestsByExpert(username, status) {
    return this.reviewHttp.getReviewRequestsByExpert(username, status);
  }

  getReviewRequestsByRequestor(username, status) {
    return this.reviewHttp.getReviewRequestsByRequestor(username, status);
  }

  createReviewRequest(data) {
    return this.reviewHttp.createReviewRequest(data);
  }

  denyReviewRequest(id) {
    return this.reviewHttp.denyReviewRequest(id);
  }
}

export {
  ReviewService
};
