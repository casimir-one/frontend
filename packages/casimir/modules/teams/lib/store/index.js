import { TeamService } from '@casimir/team-service';

import {
  listGetterFactory,
  oneGetterFactory,
  setListMutation,
  setOneMutation
} from '@casimir/platform-util';

const teamService = TeamService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory()

};

const ACTIONS = {
  async getList({ dispatch }, payload = {}) {
    if (payload.teams && payload.teams.length > 0) {
      return dispatch('getTeamsByIds', payload.teams);
    }

    return dispatch('getAllTeams');
  },

  async getAllTeams({ commit }) {
    const res = await teamService.getList();
    commit('setList', res.data.items);
  },

  async getTeamsByIds({ commit }, ids) {
    const res = await teamService.getListByIds(ids);
    commit('setList', res.data.items);
  },

  async getCurrentUserTeams({ rootGetters, dispatch }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return dispatch('getTeamsByUser', rootGetters['auth/username']);
  },

  async getTeamsByUser({ commit }, userId) {
    const res = await teamService.getListByUser(userId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, teamId) {
    const res = await teamService.getOne(teamId);
    commit('setOne', res.data);
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
  },

  async addTeamMember({ commit, rootGetters }, payload) {
    const res = await teamService.addTeamMember(payload);
    const user = rootGetters['users/one'](payload.member);
    const { teamId } = payload;
    commit('addMember', { teamId, user });

    return res.data;
  },

  async removeTeamMember({ commit }, payload) {
    await teamService.removeTeamMember(payload);
    const userId = payload.member;
    const { teamId } = payload;
    commit('removeMember', { teamId, userId });
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  addMember(state, { teamId, user }) {
    const currentTeam = state.data.find((x) => x._id === teamId);
    if (!currentTeam.members.some((x) => x._id === user._id)) {
      currentTeam.members.push(user);
    }
  },
  removeMember(state, { teamId, userId }) {
    const currentTeam = state.data.find((x) => x._id === teamId);
    currentTeam.members.splice(currentTeam.members.findIndex((x) => x._id === userId), 1);
  }
};

export const teamsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
