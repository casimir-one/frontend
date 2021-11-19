import {
  CreateProjectNdaCmd,
  CreateProposalCmd,
  UpdateProposalCmd
} from '@deip/command-models';
import { APP_PROPOSAL } from '@deip/constants';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/message-models';
import { createInstanceGetter } from '@deip/toolbox';
import { ProjectNdaHttp } from './ProjectNdaHttp';

const ndaDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 50).getTime();
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class ProjectNdaService {
  projectNdaHttp = ProjectNdaHttp.getInstance();

  proxydi = proxydi;

  async createProjectNda(payload) {
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

  async getProjectNda(externalId) {
    return this.projectNdaHttp.getProjectNda(externalId);
  }

  async getProjectNdaListByCreator(creator) {
    return this.projectNdaHttp.getProjectNdaListByCreator(creator);
  }

  async getProjectNdaListByProject(projectId) {
    return this.projectNdaHttp.getProjectNdaListByProject(projectId);
  }

  /** @type {() => ProjectNdaService} */
  static getInstance = createInstanceGetter(ProjectNdaService);
}
