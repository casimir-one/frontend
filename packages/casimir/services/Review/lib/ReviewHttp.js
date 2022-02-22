import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

/**
 * Review HTTP transport
 */
export class ReviewHttp {
  http = HttpService.getInstance();

  /**
   * Get review requests by expert and status
   * @param {string} username
   * @param {numbrer} status
   * @returns {Promise<Object>}
   */
  async getRequestListByExpert(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/expert/${username}${query}`);
  }

  /**
   * Get review requests by requestor and status
   * @param {*} username
   * @param {*} status
   * @returns {Promise<Object>}
   */
  async getRequestListByRequestor(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/requestor/${username}${query}`);
  }

  /**
   * Create review request
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createRequest(req) {
    return this.http.post('/api/v2/review-request', req.getHttpBody());
  }

  /**
   * Decline review request
   * @param {string} reviewRequestId
   * @returns {Promise<Object>}
   */
  async declineRequest(req) {
    return this.http.put('/api/v2/review-request/deny', req.getHttpBody());
  }

  /**
   * Create review
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createReview(req) {
    return this.http.post('/api/v2/review', req.getHttpBody());
  }

  /**
   * Upvote review
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async upvote(req) {
    return this.http.post('/api/v2/review/upvote', req.getHttpBody());
  }

  /**
   * Get review
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/review/${id}`);
  }

  /**
   * Get reviews by project id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.http.get(`/api/v2/reviews/project/${projectId}`);
  }

  /**
   * Get reviews by project content id
   * @param {string} projectContentId
   * @returns {Promise<Object>}
   */
  async getListByProjectContent(projectContentId) {
    return this.http.get(`/api/v2/reviews/project-content/${projectContentId}`);
  }

  /**
   * Get reviews by author
   * @param {string} author
   * @returns {Promise<Object>}
   */
  async getListByAuthor(author) {
    return this.http.get(`/api/v2/reviews/author/${author}`);
  }

  /**
   * Get review upvotes
   * @param {string} reviewId
   * @returns {Promise<Object>}
   */
  async getReviewUpvotes(reviewId) {
    return this.http.get(`/api/v2/review/votes/${reviewId}`);
  }

  /** @type {() => ReviewHttp} */
  static getInstance = createInstanceGetter(ReviewHttp);
}
