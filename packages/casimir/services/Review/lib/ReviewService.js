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

/**
 * Review data transport
 */
export class ReviewService {
  reviewHttp = ReviewHttp.getInstance();

  proxydi = proxydi;

  /**
   * Create review request
   * @param {Object} reviewRequest
   * @param {string} reviewRequest.projectContentId,
   * @param {string} reviewRequest.expert
   * @returns {Promise<Object>}
   */
  async createRequest(reviewRequest) {
    const createReviewRequestCmd = new CreateReviewRequestCmd(reviewRequest);
    const msg = new JsonDataMsg({ appCmds: [createReviewRequestCmd] });
    return this.reviewHttp.createRequest(msg);
  }

  /**
   * Decline review request
   * @param {string} reviewRequestId
   * @returns {Promise<Object>}
   */
  async declineRequest(reviewRequestId) {
    const declineReviewRequestCmd = new DeclineReviewRequestCmd({ reviewRequestId });
    const msg = new JsonDataMsg({ appCmds: [declineReviewRequestCmd] });
    return this.reviewHttp.declineRequest(msg);
  }

  /**
   * Get review requests by expert and status
   * @param {string} username
   * @param {numbrer} status
   * @returns {Promise<Object>}
   */
  async getRequestListByExpert(username, status) {
    return this.reviewHttp.getRequestListByExpert(username, status);
  }

  /**
   * Get review requests by requestor and status
   * @param {*} username
   * @param {*} status
   * @returns {Promise<Object>}
   */
  async getRequestListByRequestor(username, status) {
    return this.reviewHttp.getRequestListByRequestor(username, status);
  }

  /**
   * Create review
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {Object} payload.data
   * @param {string} payload.data.projectContentId
   * @param {string} payload.data.content
   * @param {Object} payload.data.assessment
   * @param {Object} payload.data.assessment.scores
   * @param {number} payload.data.assessment.type
   * @param {boolean} payload.data.assessment.isPositive
   * @param {Array.<string>} payload.data.domains
   * @returns {Promise<Object>}
   */
  async createReview(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      data: {
        projectContentId,
        content,
        assessment,
        domains
      }
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

  /**
   * Upvote review
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {Object} payload.data
   * @param {string} payload.data.reviewId
   * @param {string} payload.data.domainId
   * @param {Object} payload.data.weight
   * @returns {Promise<Object>}
   */
  async upvote(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      data: {
        reviewId,
        domainId,
        weight
      }
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

  /**
   * Get review
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.reviewHttp.getOne(id);
  }

  /**
   * Get reviews by project id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.reviewHttp.getListByProject(projectId);
  }

  /**
   * Get reviews by project content id
   * @param {string} projectContentId
   * @returns {Promise<Object>}
   */
  async getListByProjectContent(projectContentId) {
    return this.reviewHttp.getListByProjectContent(projectContentId);
  }

  /**
   * Get reviews by author
   * @param {string} author
   * @returns {Promise<Object>}
   */
  async getListByAuthor(author) {
    return this.reviewHttp.getListByAuthor(author);
  }

  /**
   * Get review upvotes
   * @param {string} reviewId
   * @returns {Promise<Object>}
   */
  async getReviewUpvotes(reviewId) {
    return this.reviewHttp.getReviewUpvotes(reviewId);
  }

  /** @type {() => ReviewService} */
  static getInstance = createInstanceGetter(ReviewService);
}
