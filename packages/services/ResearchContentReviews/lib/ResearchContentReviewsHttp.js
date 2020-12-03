import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentReviewsHttp extends Singleton {
  http = HttpService.getInstance();

  createReview(tx) {
    return this.http.post('/api/reviews', tx);
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
  
}

export {
  ResearchContentReviewsHttp
};
