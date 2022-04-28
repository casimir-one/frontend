import { ReviewService } from '@deip/review-service';

const reviewService = ReviewService.getInstance();

export const getAdditionalDataOne = (item) => reviewService.getReviewUpvotes(item._id)
  .then(({ data: { items: votes } }) => ({
    ...item,
    votes,
    supporters: [...new Set(votes.map((v) => v.upvoter))]
  }));

export const getAdditionalData = (
  items
) => Promise.all(items.map((item) => getAdditionalDataOne(item)));
