import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
} from '@deip/platform-util';

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
    return documentTemplateService.getListByAccount(account)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getOne({ commit }, id) {
    return documentTemplateService.getOne(id)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  create({ dispatch }, payload) {
    return documentTemplateService.create(payload)
      .then(() => {
        dispatch('getListByAccount', payload.account);
      });
  },

  update({ dispatch }, payload) {
    return documentTemplateService.update(payload)
      .then(() => {
        dispatch('getListByAccount', payload.account);
      });
  },

  remove({ commit }, templateId) {
    return documentTemplateService.delete(templateId)
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
