import { Singleton } from '@deip/toolbox';
import {
  CreateProjectNdaCmd,
  CreateProposalCmd,
  UpdateProposalCmd
} from '@deip/command-models';
import { APP_PROPOSAL } from '@deip/constants';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/message-models';
import { ProjectNdaHttp } from './ProjectNdaHttp';

const ndaDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 50).toISOString().split('.')[0]; // 50 years
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ProjectNdaService extends Singleton {
  projectNdaHttp = ProjectNdaHttp.getInstance();

  proxydi = proxydi;

  createProjectNda(payload) {
    const env = this.proxydi.get('env');

    const {
      initiator: {
        privKey,
        username: creator
      },
      parties,
      description,
      projectId,
      startTime,
      endTime = ndaDefaultLifetime,
      requestEndTime = proposalDefaultLifetime,
      approvers
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createProjectNdaCmd = new CreateProjectNdaCmd({
              creator,
              parties,
              description,
              projectId,
              startTime,
              endTime
            });
            const createProposalCmd = new CreateProposalCmd({
              creator,
              type: APP_PROPOSAL.PROJECT_NDA_PROPOSAL,
              expirationTime: requestEndTime,
              proposedCmds: [createProjectNdaCmd]
            });

            txBuilder.addCmd(createProposalCmd);

            const createProjectNdaProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: createProjectNdaProposalId,
              activeApprovalsToAdd: [...approvers]
            });

            txBuilder.addCmd(updateProposalCmd);

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.projectNdaHttp.createProjectNda(msg);
          });
      });
  }

  getProjectNda(externalId) {
    return this.projectNdaHttp.getProjectNda(externalId);
  }

  getProjectNdaListByCreator(creator) {
    return this.projectNdaHttp.getProjectNdaListByCreator(creator);
  }

  getProjectNdaListByProject(projectId) {
    return this.projectNdaHttp.getProjectNdaListByProject(projectId);
  }
}

export {
  ProjectNdaService
};
