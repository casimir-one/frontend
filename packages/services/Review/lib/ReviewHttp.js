import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ReviewHttp extends Singleton {
  http = HttpService.getInstance();

  getReviewRequestsByExpert(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/expert/${username}${query}`);
  }

  getReviewRequestsByRequestor(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/v2/review-requests/requestor/${username}${query}`);
  }

  createReviewRequest(req) {
    return this.http.post('/api/v2/review-request', req.getHttpBody());
  }

  denyReviewRequest(req) {
    return this.http.put('/api/v2/review-request/deny', req.getHttpBody());
  }

  createReview(req) {
    return this.http.post('/api/v2/review', req.getHttpBody());
  }

  upvoteReview(req) {
    return this.http.post('/api/v2/review/upvote', req.getHttpBody());
  }

  getReview(reviewId) {
    return this.http.get(`/api/v2/review/${reviewId}`);
  }

  getReviewsByProject(projectId) {
    return this.http.get(`/api/v2/reviews/project/${projectId}`);
  }

  getReviewsByProjectContent(projectContentId) {
    return this.http.get(`/api/v2/reviews/project-content/${projectContentId}`);
  }

  getReviewsByAuthor(author) {
    return this.http.get(`/api/v2/reviews/author/${author}`);
  }

  getReviewUpvotes(reviewId) {
    return this.http.get(`/api/v2/review/votes/${reviewId}`);
  }
}

export {
  ReviewHttp
};
