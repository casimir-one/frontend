import {
  Singleton,
  genSha256Hash
} from '@deip/toolbox';
import {
  CreateReviewRequestCmd,
  DeclineReviewRequestCmd,
  CreateReviewCmd,
  UpvoteReviewCmd
} from '@deip/command-models';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/message-models';
import { ReviewHttp } from './ReviewHttp';

class ReviewService extends Singleton {
  reviewHttp = ReviewHttp.getInstance();

  proxydi = proxydi;

  createReviewRequest(reviewRequest) {
    const createReviewRequestCmd = new CreateReviewRequestCmd(reviewRequest);
    const msg = new JsonDataMsg({ appCmds: [createReviewRequestCmd] });
    return this.reviewHttp.createReviewRequest(msg);
  }

  denyReviewRequest(reviewRequestId) {
    const declineReviewRequestCmd = new DeclineReviewRequestCmd({ reviewRequestId });
    const msg = new JsonDataMsg({ appCmds: [declineReviewRequestCmd] });
    return this.reviewHttp.denyReviewRequest(msg);
  }

  getReviewRequestsByExpert(username, status) {
    return this.reviewHttp.getReviewRequestsByExpert(username, status);
  }

  getReviewRequestsByRequestor(username, status) {
    return this.reviewHttp.getReviewRequestsByRequestor(username, status);
  }

  createReview(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      projectContentId,
      content,
      weight,
      assessment,
      disciplines
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createReviewCmd = new CreateReviewCmd({
              author: creator,
              projectContentId,
              content: genSha256Hash(content),
              weight,
              assessment,
              disciplines
            });

            txBuilder.addCmd(createReviewCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.reviewHttp.createReview(msg);
          });
      });
  }

  upvoteReview(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      reviewId,
      disciplineId,
      weight
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const upvoteReviewCmd = new UpvoteReviewCmd({
              voter: creator,
              reviewId,
              disciplineId,
              weight
            });

            txBuilder.addCmd(upvoteReviewCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.reviewHttp.upvoteReview(msg);
          });
      });
  }

  getReview(reviewId) {
    return this.reviewHttp.getReview(reviewId);
  }

  getReviewsByProject(projectId) {
    return this.reviewHttp.getReviewsByProject(projectId);
  }

  getReviewsByProjectContent(projectContentId) {
    return this.reviewHttp.getReviewsByProjectContent(projectContentId);
  }

  getReviewsByAuthor(author) {
    return this.reviewHttp.getReviewsByAuthor(author);
  }

  getReviewUpvotes(reviewId) {
    return this.reviewHttp.getReviewUpvotes(reviewId);
  }
}

export {
  ReviewService
};
