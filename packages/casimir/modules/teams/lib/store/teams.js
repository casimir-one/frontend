import { TeamService } from '@deip/team-service';

import {
  crudGetters,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

const teamService = TeamService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  ...crudGetters
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    if (payload.teams && payload.teams.length > 0) {
      return dispatch('getTeamsByIds', payload.teams);
    }

    return dispatch('getAllTeams');
  },

  getAllTeams({ commit }) {
    return teamService.getTeamsListing()
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  /** @return {Promise<object[]>} */
  getTeamsByIds({ commit }, ids) {
    return teamService.getTeams(ids)
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getTeamsByUser({ commit }, userId) {
    return teamService.getTeamsByUser(userId)
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getOne({ commit }, payload) {
    return teamService
      .getTeam(payload)
      .then((res) => {
        commit('setOne', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  create({ dispatch }, payload) {
    const {
      isCreateDefaultProject,
      members = [],
      ...data
    } = payload;

    return teamService
      .createTeam({ ...data, members }, isCreateDefaultProject)
      .then((res) => {
        dispatch('getOne', res._id);
        dispatch('currentUser/get', null, { root: true }); // update current user roles

        return res;
      });
  },

  update({ dispatch }, payload) {
    return teamService
      .updateTeam(payload)
      .then((res) => {
        dispatch('getOne', res._id);

        return res;
      });
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
