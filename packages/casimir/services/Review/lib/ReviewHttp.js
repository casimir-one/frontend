import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ReviewHttp {
  http = HttpService.getInstance();

  async getReviewRequestsByExpert(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/expert/${username}${query}`);
  }

  async getReviewRequestsByRequestor(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/requestor/${username}${query}`);
  }

  async createReviewRequest(req) {
    return this.http.post('/api/v2/review-request', req.getHttpBody());
  }

  async denyReviewRequest(req) {
    return this.http.put('/api/v2/review-request/deny', req.getHttpBody());
  }

  async createReview(req) {
    return this.http.post('/api/v2/review', req.getHttpBody());
  }

  async upvoteReview(req) {
    return this.http.post('/api/v2/review/upvote', req.getHttpBody());
  }

  async getReview(reviewId) {
    return this.http.get(`/api/v2/review/${reviewId}`);
  }

  async getReviewsByProject(projectId) {
    return this.http.get(`/api/v2/reviews/project/${projectId}`);
  }

  async getReviewsByProjectContent(projectContentId) {
    return this.http.get(`/api/v2/reviews/project-content/${projectContentId}`);
  }

  async getReviewsByAuthor(author) {
    return this.http.get(`/api/v2/reviews/author/${author}`);
  }

  async getReviewUpvotes(reviewId) {
    return this.http.get(`/api/v2/review/votes/${reviewId}`);
  }

  /** @type {() => ReviewHttp} */
  static getInstance = createInstanceGetter(ReviewHttp);
}
