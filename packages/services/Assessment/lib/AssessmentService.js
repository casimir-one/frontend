import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { AppConfigService } from '@deip/app-config-service';
import { BlockchainService } from '@deip/blockchain-service';

class AssessmentService extends Singleton {

  blockchainService = BlockchainService.getInstance();

  
  createAssessment(privKey, {
    creator,
    stages,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [assessment_external_id, create_assessment_op] = deipRpc.operations.createEntityOperation(['create_assessment', {
          creator,
          stages,
          extensions
        }], refBlock);

        return this.blockchainService.signOperations([create_assessment_op], privKey, refBlock)
          .then((signedTx) => {
            return this.blockchainService.sendTransactionAsync(signedTx)
          });
      });

  }

}

export {
  AssessmentService
};
