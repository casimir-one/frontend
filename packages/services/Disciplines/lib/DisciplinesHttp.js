import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class DisciplinesHttp extends Singleton {
  http = HttpService.getInstance();

  getAllDisciplines() {
    return this.http.get(`/api/disciplines`);
  }

  getExpertiseClaims(status = 'pending') {
    return this.http.get(`/api/expertise-claims?status=${status}`);
  }

  getExpertiseClaimsByUse(username) {
    return this.http.get(`/api/expertise-claims/user/${username}`);
  }

  getExpertiseClaimsByDiscipline(disciplineId) {
    return this.http.get(`/api/expertise-claims/discipline/${disciplineId}`);
  }

  getExpertiseClaimsByUserAndDiscipline(username, disciplineId) {
    return this.http.get(`/api/expertise-claims/user/${username}/discipline/${disciplineId}`);
  }

  createExpertiseClaim(tx, publications) {
    return this.http.post('/api/expertise-claims', { tx, publications });
  }

  voteForExpertiseClaim(tx) {
    return this.http.post('/api/expertise-claims/vote', tx);
  }
}

export {
  DisciplinesHttp
};
