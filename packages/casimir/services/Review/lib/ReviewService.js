import { genSha256Hash, createInstanceGetter } from '@deip/toolbox';
import {
  CreateReviewRequestCmd,
  DeclineReviewRequestCmd,
  CreateReviewCmd,
  UpvoteReviewCmd
} from '@deip/commands';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/messages';
import { ReviewHttp } from './ReviewHttp';

export class ReviewService {
  reviewHttp = ReviewHttp.getInstance();

  proxydi = proxydi;

  async createRequest(reviewRequest) {
    const createReviewRequestCmd = new CreateReviewRequestCmd(reviewRequest);
    const msg = new JsonDataMsg({ appCmds: [createReviewRequestCmd] });
    return this.reviewHttp.createRequest(msg);
  }

  async denyRequest(reviewRequestId) {
    const declineReviewRequestCmd = new DeclineReviewRequestCmd({ reviewRequestId });
    const msg = new JsonDataMsg({ appCmds: [declineReviewRequestCmd] });
    return this.reviewHttp.denyRequest(msg);
  }

  async getListByExpert(username, status) {
    return this.reviewHttp.getListByExpert(username, status);
  }

  async getListByRequestor(username, status) {
    return this.reviewHttp.getListByRequestor(username, status);
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

  async upvote(payload) {
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
            return this.reviewHttp.upvote(msg);
          });
      });
  }

  async getOne(id) {
    return this.reviewHttp.getOne(id);
  }

  async getListByProject(projectId) {
    return this.reviewHttp.getListByProject(projectId);
  }

  async getListByProjectContent(projectContentId) {
    return this.reviewHttp.getListByProjectContent(projectContentId);
  }

  async getListByAuthor(author) {
    return this.reviewHttp.getListByAuthor(author);
  }

  async getReviewUpvotes(reviewId) {
    return this.reviewHttp.getReviewUpvotes(reviewId);
  }

  /** @type {() => ReviewService} */
  static getInstance = createInstanceGetter(ReviewService);
}
