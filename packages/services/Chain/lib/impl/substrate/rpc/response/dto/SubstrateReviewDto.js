import ReviewDto from './../../../../../base/rpc/response/dto/ReviewDto';
import { fromHexFormat } from './../../../utils';
import { hexToString, u8aToHex } from '@polkadot/util';


class SubstrateReviewDto extends ReviewDto {

  constructor(review) {

    const reviewId = fromHexFormat(review.externalId);
    const sourceId = fromHexFormat(review.projectContentExternalId);
    const content = fromHexFormat(review.content);
    const author = review.author.daoId ? fromHexFormat(review.author.daoId) : review.author.address;
    const domains = review.domains.map((domainId) => fromHexFormat(domainId));
    const type = review.assessmentModel;

    let model;
    try {
      model = JSON.parse(hexToString(u8aToHex(review.weight)));
    } catch(err) {
      model = review.weight || {};
    }

    const assessment = { type, model };

    super({
      reviewId,
      sourceId,
      content,
      author,
      domains,
      assessment
    });
  }

}


export default SubstrateReviewDto;