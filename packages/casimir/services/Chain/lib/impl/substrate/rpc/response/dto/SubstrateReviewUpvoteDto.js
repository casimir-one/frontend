import ReviewUpvoteDto from './../../../../../base/rpc/response/dto/ReviewUpvoteDto';
import { fromHexFormat } from './../../../utils';


class SubstrateReviewUpvoteDto extends ReviewUpvoteDto {

  constructor(upvote) {

    const upvoter = upvote.upvoter.daoId ? fromHexFormat(upvote.upvoter.daoId) : upvote.upvoter.address;
    const reviewId = fromHexFormat(upvote.reviewId);
    const domainId = fromHexFormat(upvote.domainId);
    const votingTime = upvote.votingTime;

    super({
      upvoter,
      domainId,
      reviewId,
      votingTime
    });
  }

}


export default SubstrateReviewUpvoteDto;