import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
} from '@deip/platform-store';

import { DocumentTemplateService } from '@deip/document-template-service';

const documentTemplateService = DocumentTemplateService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getListByAccount({ commit }, account) {
    return documentTemplateService.getDocumentTemplatesByAccount(account)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getOne({ commit }, id) {
    return documentTemplateService.getDocumentTemplate(id)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  create({ dispatch }, payload) {
    return documentTemplateService.createDocumentTemplate(payload)
      .then(() => {
        dispatch('getListByAccount', payload.account);
      });
  },

  update({ dispatch }, payload) {
    return documentTemplateService.updateDocumentTemplate(payload)
      .then(() => {
        dispatch('getListByAccount', payload.account);
      });
  },

  remove({ commit }, templateId) {
    return documentTemplateService.deleteDocumentTemplate(templateId)
      .then(() => {
        commit('remove', templateId);
      });
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  remove: removeFromListMutation
};

export const documentTemplatesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
