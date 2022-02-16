import { get } from '@deip/toolbox/lodash';

import { ProjectService } from '@deip/project-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

const projectService = ProjectService.getInstance();

const actionsMap = {
  projects: {
    public: {
      all: 'getPublicProjects'
    },
    user: {
      all: 'getUserProjects',
      following: 'getProjectsByIds',
      public: 'getUserPublicProjects',
      personal: 'getUserPersonalProjects'
    },
    team: {
      all: 'getTeamProjects'
    },
    portal: {
      all: 'getPortalProjects'
    }
  }
};

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  // list
  getList({ dispatch }, payload = {}) {
    const target = [payload.scope];

    if (payload.username) target.push('user');
    else if (payload.teamId) target.push('team');
    else if (payload.portalId) target.push('portal');
    else target.push('public');

    target.push(payload.type || 'all');

    return dispatch(get(actionsMap, target), payload);
  },

  // public

  getPublicProjects({ commit }, { filter = {} }) {
    return projectService.getPublicProjectList(filter)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // user

  getUserProjects({ commit }, { username }) {
    return projectService.getUserProjectList(username)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getUserPublicProjects({ commit }, { username }) {
    return projectService.getUserPublicProjectList(username)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getUserPersonalProjects({ commit }, { username }) {
    return projectService.getUserPersonalProjectList(username)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getProjectsByIds({ commit }, projectIds) {
    return projectService.getListByIds(projectIds)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return projectService.getTeamProjectList(teamId)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // portal

  getPortalProjects({ commit }, { portalId }) {
    return projectService.getPortalProjectList(portalId)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // one

  getOne({ commit }, projectId) {
    return projectService.getOne(projectId)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  async getTeamDefaultProject(_, teamId) {
    const res = await projectService.getTeamDefaultProject(teamId);
    return res.data;
  },

  async create({ dispatch }, payload) {
    const res = await projectService.create({
      ...payload,
      proposalInfo: { isProposal: false }
    });

    dispatch('getOne', res.data._id);
    return res.data;
  },

  async update({ dispatch }, payload) {
    const res = await projectService.update({
      ...payload,
      proposalInfo: { isProposal: false }
    });
    dispatch('getOne', res.data._id);
    return res.data;
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const projectsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
