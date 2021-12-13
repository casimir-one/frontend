import { assert } from '@deip/toolbox';
import { isValidTimestampFormat } from './../utils';


class ReviewUpvoteDto {

  constructor({
    upvoter,
    domainId,
    reviewId,
    votingTime,
    weight
  }) {

    assert(!!upvoter, "Upvote author is not specified");
    assert(!!domainId, "Upvote 'domainId' is not specified");
    assert(!!reviewId, "Upvote review ID is not specified");
    assert(isValidTimestampFormat(votingTime), "Upvote 'votingTime' is not specified");

    this.upvoter = upvoter;
    this.domainId = domainId;
    this.reviewId = reviewId;
    this.votingTime = votingTime;
    this.weight = weight || null;
  }

}


export default ReviewUpvoteDto;