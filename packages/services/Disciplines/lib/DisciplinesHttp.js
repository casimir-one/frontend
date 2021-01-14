import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class DisciplinesHttp extends Singleton {
  http = HttpService.getInstance();

  getAllDisciplines() {
    return this.http.get(`/api/disciplines`);
  }
}

export {
  DisciplinesHttp
};
