import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class GrantsHttp {
  http = HttpService.getInstance();

  async getAwardWithdrawalRequestPackageRef(awardNumber, paymentNumber) {
    return this.http.get(`/api/award-withdrawal-requests/${awardNumber}/${paymentNumber}`);
  }

  async createGrantAwardWithdrawalRequest(projectId, formData) {
    return this.http.post(`/api/award-withdrawal-requests/upload-attachments`, formData, {
      headers: {
        'Project-Id': projectId,
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /** @type {() => GrantsHttp} */
  static getInstance = createInstanceGetter(GrantsHttp);
}
