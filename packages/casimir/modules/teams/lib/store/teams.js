import { TeamService } from '@deip/team-service';

import {
  listGetterFactory,
  oneGetterFactory,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

const teamService = TeamService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory()
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    if (payload.teams && payload.teams.length > 0) {
      return dispatch('getTeamsByIds', payload.teams);
    }

    return dispatch('getAllTeams');
  },

  getAllTeams({ commit }) {
    return teamService.getList()
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  /** @return {Promise<object[]>} */
  getTeamsByIds({ commit }, ids) {
    return teamService.getListByIds(ids)
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getTeamsByUser({ commit }, userId) {
    return teamService.getListByUser(userId)
      .then((res) => {
        commit('setList', res.data.items);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getOne({ commit }, teamId) {
    return teamService
      .getOne(teamId)
      .then((res) => {
        commit('setOne', res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  async create({ dispatch }, payload) {
    const {
      isCreateDefaultProject,
      members = [],
      ...data
    } = payload;

    const res = await teamService.create({ ...data, members }, isCreateDefaultProject);
    dispatch('getOne', res.data._id);
    dispatch('currentUser/get', null, { root: true }); // update current user roles

    return res.data;
  },

  async update({ dispatch }, payload) {
    const res = await teamService.update(payload);
    dispatch('getOne', res.data._id);

    return res.data;
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const teamsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
