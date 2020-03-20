import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { Singleton } from '@deip/toolbox';
import { ResearchContentReviewsHttp } from './ResearchContentReviewsHttp';
import { assessmentCriterias } from './constants';

class ResearchContentReviewsService extends Singleton {
  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  researchContentReviewsHttp = ResearchContentReviewsHttp.getInstance();

  getAssessmentCriteriasForResearchContent(typeCode) {
    return assessmentCriterias[typeCode] || assessmentCriterias.default;
  }

  makeReview(author, researchContentId, text, weight, assessment, extensions) {
    const review = {
      author: author,
      research_content_id: researchContentId,
      content: text,
      weight: weight,
      assessment_model: assessment,
      extensions: extensions
    };

    const operation = ['make_review', review];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.researchContentReviewsHttp.sendMakeReviewOp(signedTx));
  }
 
  getReviewRequestsByExpert(username, status) {
    return this.researchContentReviewsHttp.getReviewRequestsByExpert(username, status);
  }

  getReviewRequestsByRequestor(username, status) {
    return this.researchContentReviewsHttp.getReviewRequestsByRequestor(username, status);
  }

  createReviewRequest(data) {
    return this.researchContentReviewsHttp.createReviewRequest(data);
  }

  denyReviewRequest(id) {
    return this.researchContentReviewsHttp.denyReviewRequest(id);
  }
}

export {
  ResearchContentReviewsService
};
