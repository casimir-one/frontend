import { get } from 'lodash/fp';

import { ResearchService } from '@deip/research-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns';

const researchService = ResearchService.getInstance();

const actionsMap = {
  projects: {
    public: {
      all: 'getPublicProjects'
    },
    user: {
      all: 'getUserProjects',
      following: 'getUserFollowingProjects',
      public: 'getUserPublicProjects',
      teams: 'getUserTeamsProjects',
      personal: 'getUserPersonalProjects'
    },
    team: {
      all: 'getTeamProjects'
    },
    tenant: {
      all: 'getTenantProjects'
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
  getProjects({ dispatch }, payload = {}) {
    const target = [payload.scope];

    if (payload.username) target.push('user');
    else if (payload.teamId) target.push('team');
    else if (payload.tenantId) target.push('tenant');
    else target.push('public');

    target.push(payload.type || 'all');

    return dispatch(get(target, actionsMap), payload);
  },

  // public

  getPublicProjects({ commit }, { filter = {} }) {
    return researchService.getPublicResearchListing(filter)
      .then((result) => {
        commit('setList', result);
      });
  },

  // user

  getUserProjects({ commit }, { username }) {
    return researchService.getUserResearchListing(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPublicProjects({ commit }, { username }) {
    return researchService.getUserPublicProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserTeamsProjects({ commit }, { username }) {
    return researchService.getUserTeamsProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPersonalProjects({ commit }, { username }) {
    return researchService.getUserPersonalProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserFollowingProjects({ commit }, { externalIds }) {
    return researchService.getResearches(externalIds)
      .then((result) => {
        commit('setList', result);
      });
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return researchService.getResearchGroupResearchListing(teamId)
      .then((result) => {
        commit('setList', result);
      });
  },

  // tenant

  getTenantProjects({ commit }, { tenantId }) {
    return researchService.getTenantResearchListing(tenantId)
      .then((result) => {
        commit('setList', result);
      });
  },

  // one

  getProjectDetails({ commit }, projectId) {
    return researchService.getResearch(projectId)
      .then((result) => {
        commit('setOne', result);
      });
  },

  createProject({ commit }, payload) {
    const { creator, isProposal, formData } = payload;
    return researchService.createResearch(
      creator,
      isProposal,
      formData,
      false
    )
      .then((result) => {
        commit('setOne', result);
      });
  },

  updateProject({ commit }, payload) {
    const { creator, isProposal, formData } = payload;

    return researchService.updateResearch(
      creator,
      isProposal,
      formData
    )
      .then((result) => {
        commit('setOne', result);
      });
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
