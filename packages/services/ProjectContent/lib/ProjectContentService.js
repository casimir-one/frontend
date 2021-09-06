import {
  Singleton,
  createFormData,
  genRipemd160Hash,
  genSha256Hash
} from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg, MultFormDataMsg } from '@deip/message-models';
import { APP_PROPOSAL } from '@deip/constants';
import {
  CreateProposalCmd,
  UpdateProposalCmd,
  CreateProjectContentCmd,
  CreateDraftCmd,
  DeleteDraftCmd,
  UpdateDraftCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { ProjectContentHttp } from './ProjectContentHttp';
import { projectContentTypes } from './lists';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ProjectContentService extends Singleton {
  proxydi = proxydi;

  projectContentHttp = ProjectContentHttp.getInstance();

  createProjectContent(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      ...data
    } = payload;

    const {
      proposalInfo: {
        isProposal = false,
        isProposalApproved = true,
        proposalLifetime = proposalDefaultLifetime
      } = {},
      projectId,
      teamId,
      type,
      title,
      content,
      authors,
      references
    } = data;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const txBuilder = chainService.getChainTxBuilder();
        return txBuilder
          .begin()
          .then(() => {
            const createProjectContentCmd = new CreateProjectContentCmd({
              projectId,
              teamId,
              type,
              description: genSha256Hash({ researchContent: { title } }),
              content,
              authors,
              references,
              title
            });

            if (isProposal) {
              const createProposalCmd = new CreateProposalCmd({
                creator,
                type: APP_PROPOSAL.PROJECT_CONTENT_PROPOSAL,
                expirationTime: proposalLifetime,
                proposedCmds: [createProjectContentCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const createProjectContentProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: createProjectContentProposalId,
                  activeApprovalsToAdd: [creator]
                });

                txBuilder.addCmd(updateProposalCmd);
              }
            } else {
              txBuilder.addCmd(createProjectContentCmd);
            }
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'project-id': projectId });
            return this.projectContentHttp.publishProjectContent(msg);
          });
      });
  }

  getProjectContent(externalId) {
    return this.projectContentHttp.getProjectContent(externalId);
  }

  getDraftsByProject(projectId) {
    return this.projectContentHttp.getDraftsByProject(projectId);
  }

  getDraft(draftId) {
    return this.projectContentHttp.getDraft(draftId);
  }

  getProjectContentsByTenant(tenantId) {
    return this.projectContentHttp.getProjectContentsByTenant(tenantId);
  }

  getProjectContentsByProject(projectId) {
    return this.projectContentHttp.getProjectContentsByProject(projectId);
  }

  getProjectContentRef(refId) {
    return this.projectContentHttp.getProjectContentRef(refId);
  }

  createProjectContentDraft(payload) {
    const draftId = genRipemd160Hash({
      ...payload, __timestamp: new Date().getTime()
    }).slice(0, 24);
    const draftData = {
      ...payload,
      draftId
    };

    const formData = createFormData(draftData);

    const createDraftCmd = new CreateDraftCmd(draftData);
    const msg = new MultFormDataMsg(formData, { appCmds: [createDraftCmd] }, { 'project-id': draftData.projectId });
    return this.projectContentHttp.createProjectContentDraft(msg);
  }

  deleteProjectContentDraft(draftId) {
    const deleteDraftCmd = new DeleteDraftCmd({ draftId });
    const msg = new JsonDataMsg({ appCmds: [deleteDraftCmd] }, { 'entity-id': draftId });
    return this.projectContentHttp.deleteProjectContentDraft(msg);
  }

  unlockDraft(draft) {
    const updateDraftCmd = new UpdateDraftCmd({ ...draft });
    const msg = new JsonDataMsg({ appCmds: [updateDraftCmd] }, { 'entity-id': draft._id });
    return this.projectContentHttp.unlockProjectContentDraft(msg);
  }

  getPublicProjectContentListing() {
    return this.projectContentHttp.getPublicProjectContentListing();
  }

  getProjectContentReferencesGraph(contentId) {
    return this.projectContentHttp.getProjectContentReferencesGraph(contentId);
  }

  getProjectContentType(type) {
    return projectContentTypes.find((t) => t.type === type);
  }
}

export {
  ProjectContentService
};
