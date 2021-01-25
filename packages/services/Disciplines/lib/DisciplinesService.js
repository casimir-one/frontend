import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';
import { Singleton } from '@deip/toolbox';
import { DisciplinesHttp } from './DisciplinesHttp';

class DisciplinesService extends Singleton {
  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  disciplinesHttp = DisciplinesHttp.getInstance();

  getAllDisciplines() {
    return this.disciplinesHttp.getAllDisciplines();
  }

  getDisciplinesByResearch(researchExternalId) {
    return this.disciplinesHttp.getDisciplinesByResearch(researchExternalId);
  }


}

export {
  DisciplinesService
};
