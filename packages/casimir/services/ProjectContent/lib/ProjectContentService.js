import {
  createFormData,
  genRipemd160Hash,
  genSha256Hash,
  createInstanceGetter
} from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg, MultFormDataMsg } from '@deip/messages';
import { APP_PROPOSAL } from '@deip/constants';
import {
  CreateProposalCmd,
  AcceptProposalCmd,
  CreateProjectContentCmd,
  CreateDraftCmd,
  DeleteDraftCmd,
  UpdateDraftCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { ProjectContentHttp } from './ProjectContentHttp';
import { projectContentTypes } from './lists';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class ProjectContentService {
  proxydi = proxydi;

  projectContentHttp = ProjectContentHttp.getInstance();

  async createProjectContent(payload) {
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
      contentType,
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
              contentType,
              description: genSha256Hash({ projectContent: { title } }),
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
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: createProjectContentProposalId,
                  account: creator
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

  async getProjectContent(projectContentId) {
    return this.projectContentHttp.getProjectContent(projectContentId);
  }

  async getDraftsByProject(projectId) {
    return this.projectContentHttp.getDraftsByProject(projectId);
  }

  async getDraft(draftId) {
    return this.projectContentHttp.getDraft(draftId);
  }

  async getProjectContentsByPortal(portalId) {
    return this.projectContentHttp.getProjectContentsByPortal(portalId);
  }

  async getProjectContentsByProject(projectId) {
    return this.projectContentHttp.getProjectContentsByProject(projectId);
  }

  async getProjectContentRef(refId) {
    return this.projectContentHttp.getProjectContentRef(refId);
  }

  async createProjectContentDraft(payload) {
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

  async deleteProjectContentDraft(draftId) {
    const deleteDraftCmd = new DeleteDraftCmd({ draftId });
    const msg = new JsonDataMsg({ appCmds: [deleteDraftCmd] }, { 'entity-id': draftId });
    return this.projectContentHttp.deleteProjectContentDraft(msg);
  }

  async updateProjectContentDraft(payload) {
    const formData = createFormData(payload);

    const updateDraftCmd = new UpdateDraftCmd(payload);
    const msg = new MultFormDataMsg(formData, { appCmds: [updateDraftCmd] }, { 'project-id': payload.projectId, 'entity-id': payload._id });
    return this.projectContentHttp.updateProjectContentDraft(msg);
  }

  async unlockDraft(draft) {
    const updateDraftCmd = new UpdateDraftCmd({ ...draft });
    const msg = new JsonDataMsg({ appCmds: [updateDraftCmd] }, { 'entity-id': draft._id });
    return this.projectContentHttp.unlockProjectContentDraft(msg);
  }

  async getPublicProjectContentListing() {
    return this.projectContentHttp.getPublicProjectContentListing();
  }

  async getProjectContentReferencesGraph(contentId) {
    return this.projectContentHttp.getProjectContentReferencesGraph(contentId);
  }

  getProjectContentType(type) {
    return projectContentTypes.find((t) => t.type === type || t.id === type);
  }

  /** @type {() => ProjectContentService} */
  static getInstance = createInstanceGetter(ProjectContentService);
}
