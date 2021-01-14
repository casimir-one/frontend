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

  createExpertiseClaim(claimer, disciplineId, description, publications) {
    const claim = {
      claimer,
      discipline_id: disciplineId,
      description
    };
    const operation = ['create_expertise_allocation_proposal', claim];
    return this.blockchainService.signOperations([operation], this.accessService.getOwnerWif())
      .then((signedTx) => this.disciplinesHttp.createExpertiseClaim(signedTx, publications));
  }

  voteForExpertiseClaim(proposalId, voter, votingPower) {
    const vote = {
      proposal_id: proposalId,
      voter,
      voting_power: votingPower
    };

    const operation = ['vote_for_expertise_allocation_proposal', vote];
    return this.blockchainService.signOperations([operation], this.accessService.getOwnerWif())
      .then((signedTx) => this.disciplinesHttp.voteForExpertiseClaim(signedTx));
  }
}

export {
  DisciplinesService
};
