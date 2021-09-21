import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class GrantsHttp extends Singleton {
  http = HttpService.getInstance();

  getAwardWithdrawalRequestPackageRef(awardNumber, paymentNumber) {
    return this.http.get(`/api/award-withdrawal-requests/${awardNumber}/${paymentNumber}`);
  }

  createGrantAwardWithdrawalRequest(researchExternalId, formData) {
    return this.http.post(`/api/award-withdrawal-requests/upload-attachments`, formData, {
      headers: {
        'Research-External-Id': researchExternalId,
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export {
  GrantsHttp
};
