import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { Singleton } from '@deip/toolbox';
import { ResearchContentReviewsHttp } from './ResearchContentReviewsHttp';
import { assessmentCriterias } from './constants';

class ResearchContentReviewsService extends Singleton {
  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  researchContentReviewsHttp = ResearchContentReviewsHttp.getInstance();

  getAssessmentCriteria(typeCode) {
    return assessmentCriterias[typeCode] || assessmentCriterias.default;
  }

  makeReview(researchContentId, isPositive, text) {
    const review = {
      author: this.accessService.getDecodedToken().username,
      research_content_id: researchContentId,
      is_positive: isPositive,
      content: text,
      weight: 10000
    };

    const operation = ['make_review', review];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchContentReviewsHttp.sendMakeReviewOp(signedTx));
  }
}

export {
  ResearchContentReviewsService
};
