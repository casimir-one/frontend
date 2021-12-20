import { ProjectContentService } from '@deip/project-content-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory,
  removeFromListMutationFactory
} from '@deip/platform-store';

const projectContentService = ProjectContentService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: '_id' })
};

const ACTIONS = {
  async getListByProjectId({ commit }, projectId) {
    const list = await projectContentService.getDraftsByProject(projectId);
    commit('setList', list);
  },

  async getOne({ commit }, id) {
    const draft = await projectContentService.getDraft(id);
    commit('setOne', draft);
  },

  async create(_, payload) {
    const {
      projectId,
      title,
      contentType,
      authors,
      references,
      formatType,
      files,
      jsonData
    } = payload;

    return projectContentService.createProjectContentDraft({
      projectId,
      title,
      contentType,
      authors,
      references,
      formatType,
      files,
      jsonData
    });
  },

  async update(_, payload) {
    return projectContentService.updateProjectContentDraft(payload);
  },

  async remove({ commit }, id) {
    await projectContentService.deleteProjectContentDraft(id);
    commit('remove', id);
  },

  async publish({ commit }, payload) {
    const {
      initiator,
      data: {
        _id,
        projectId,
        teamId,
        contentType,
        title,
        authors,
        references,
        hash
      }
    } = payload;
    await projectContentService.createProjectContent(
      {
        initiator,
        proposalInfo: { isProposal: false },
        projectId,
        teamId,
        contentType,
        title,
        content: hash,
        authors,
        references
      }
    );
    commit('remove', _id);
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: '_id' }),
  setOne: setOneMutationFactory({ mergeKey: '_id' }),
  remove: removeFromListMutationFactory({ mergeKey: '_id' })
};

export const projectContentDraftStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
