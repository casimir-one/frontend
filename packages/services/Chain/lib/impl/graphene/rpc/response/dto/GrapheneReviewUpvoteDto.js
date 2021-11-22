import ReviewUpvoteDto from './../../../../../base/rpc/response/dto/ReviewUpvoteDto';


class GrapheneReviewUpvoteDto extends ReviewUpvoteDto {

  constructor(upvote) {

    const upvoter = upvote.voter;
    const reviewId = upvote.review_external_id;
    const domainId = upvote.discipline_external_id;
    const votingTime = new Date(upvote.voting_time).getTime();
    const weight = upvote.weight;

    super({
      upvoter,
      domainId,
      reviewId,
      votingTime,
      weight
    });
  }

}


export default GrapheneReviewUpvoteDto;