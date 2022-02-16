import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ReviewHttp {
  http = HttpService.getInstance();

  async getListByExpert(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/expert/${username}${query}`);
  }

  async getListByRequestor(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/requestor/${username}${query}`);
  }

  async createRequest(req) {
    return this.http.post('/api/v2/review-request', req.getHttpBody());
  }

  async denyRequest(req) {
    return this.http.put('/api/v2/review-request/deny', req.getHttpBody());
  }

  async createReview(req) {
    return this.http.post('/api/v2/review', req.getHttpBody());
  }

  async upvote(req) {
    return this.http.post('/api/v2/review/upvote', req.getHttpBody());
  }

  async getOne(id) {
    return this.http.get(`/api/v2/review/${id}`);
  }

  async getListByProject(projectId) {
    return this.http.get(`/api/v2/reviews/project/${projectId}`);
  }

  async getListByProjectContent(projectContentId) {
    return this.http.get(`/api/v2/reviews/project-content/${projectContentId}`);
  }

  async getListByAuthor(author) {
    return this.http.get(`/api/v2/reviews/author/${author}`);
  }

  async getReviewUpvotes(reviewId) {
    return this.http.get(`/api/v2/review/votes/${reviewId}`);
  }

  /** @type {() => ReviewHttp} */
  static getInstance = createInstanceGetter(ReviewHttp);
}
