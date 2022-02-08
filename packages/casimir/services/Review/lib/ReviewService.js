import { genSha256Hash, createInstanceGetter } from '@deip/toolbox';
import {
  CreateReviewRequestCmd,
  DeclineReviewRequestCmd,
  CreateReviewCmd,
  UpvoteReviewCmd
} from '@deip/command-models';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/messages';
import { ReviewHttp } from './ReviewHttp';

export class ReviewService {
  reviewHttp = ReviewHttp.getInstance();

  proxydi = proxydi;

  async createReviewRequest(reviewRequest) {
    const createReviewRequestCmd = new CreateReviewRequestCmd(reviewRequest);
    const msg = new JsonDataMsg({ appCmds: [createReviewRequestCmd] });
    return this.reviewHttp.createReviewRequest(msg);
  }

  async denyReviewRequest(reviewRequestId) {
    const declineReviewRequestCmd = new DeclineReviewRequestCmd({ reviewRequestId });
    const msg = new JsonDataMsg({ appCmds: [declineReviewRequestCmd] });
    return this.reviewHttp.denyReviewRequest(msg);
  }

  async getReviewRequestsByExpert(username, status) {
    return this.reviewHttp.getReviewRequestsByExpert(username, status);
  }

  async getReviewRequestsByRequestor(username, status) {
    return this.reviewHttp.getReviewRequestsByRequestor(username, status);
  }

  async createReview(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      projectContentId,
      content,
      assessment,
      domains
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
              content,
              contentHash: genSha256Hash(content),
              assessment,
              domains
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

  async upvoteReview(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      reviewId,
      domainId,
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
              domainId,
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

  async getReview(reviewId) {
    return this.reviewHttp.getReview(reviewId);
  }

  async getReviewsByProject(projectId) {
    return this.reviewHttp.getReviewsByProject(projectId);
  }

  async getReviewsByProjectContent(projectContentId) {
    return this.reviewHttp.getReviewsByProjectContent(projectContentId);
  }

  async getReviewsByAuthor(author) {
    return this.reviewHttp.getReviewsByAuthor(author);
  }

  async getReviewUpvotes(reviewId) {
    return this.reviewHttp.getReviewUpvotes(reviewId);
  }

  /** @type {() => ReviewService} */
  static getInstance = createInstanceGetter(ReviewService);
}
