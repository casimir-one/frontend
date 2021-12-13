import { assert, isBoolean } from '@deip/toolbox';


class ReviewDto {

  constructor({
    reviewId,
    sourceId,
    content,
    author,
    domains,
    isPositive,
    eciMap,
    assessment
  }) {

    assert(!!reviewId, "Review ID is not specified");
    assert(!!sourceId, "Review 'sourceId' is not specified");
    assert(!!content, "Review content hash is not specified");
    assert(!!author, "Review 'author' hash is not specified");
    assert(!!domains && domains.length, "Review 'domains' are not specified");
    assert(!!assessment, "Review 'assessment' is not specified");

    this.reviewId = reviewId;
    this.sourceId = sourceId;
    this.content = content;
    this.author = author;
    this.domains = domains;
    this.assessment = assessment;
    this.isPositive = isPositive || null;
    this.eciMap = eciMap || {};
  }

}


export default ReviewDto;
