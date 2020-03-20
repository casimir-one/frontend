import { Singleton } from '@deip/toolbox';
import { ReviewHttp } from './ReviewHttp';

class ReviewService extends Singleton {
  reviewHttp = ReviewHttp.getInstance();
}

export {
  ReviewService
};
