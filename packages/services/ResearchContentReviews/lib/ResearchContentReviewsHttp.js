import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentReviewsHttp extends Singleton {
  http = HttpService.getInstance();

  createReview(tx, offchainMeta) {
    return this.http.post('/api/reviews', { tx, offchainMeta });
  }

  getReview(reviewExternalId) {
    return this.http.get(`/api/reviews/${reviewExternalId}`);
  }

  getReviewsByResearch(researchExternalId) {
    return this.http.get(`/api/reviews/research/${researchExternalId}`);
  }

  getReviewsByResearchContent(researchContentExternalId) {
    return this.http.get(`/api/reviews/research-content/${researchContentExternalId}`);
  }

  getReviewsByAuthor(author) {
    return this.http.get(`/api/reviews/author/${author}`);
  }

  getReviewRequestsByExpert(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/review-requests/expert/${username}${query}`);
  }

  getReviewRequestsByRequestor(username, status) {
    const query = status ? `?status=${status}` : '';
    return this.http.get(`/api/review-requests/requestor/${username}${query}`);
  }

  createReviewRequest(data) {
    return this.http.post('/api/review-requests', data);
  }

  denyReviewRequest(id) {
    return this.http.post(`/api/review-requests/${id}/deny`, null);
  }

  getReviewVotes(reviewExternalId) {
    return this.http.get(`/api/reviews/votes/${reviewExternalId}`);
  }

}

export {
  ResearchContentReviewsHttp
};
