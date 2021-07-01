import { get } from 'lodash/fp';

import { ProjectService } from '@deip/project-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns';

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
    return projectService.getPublicProjectListing(filter)
      .then((result) => {
        commit('setList', result);
      });
  },

  // user

  getUserProjects({ commit }, { username }) {
    return projectService.getUserProjectListing(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPublicProjects({ commit }, { username }) {
    return projectService.getUserPublicProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserTeamsProjects({ commit }, { username }) {
    return projectService.getUserTeamsProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPersonalProjects({ commit }, { username }) {
    return projectService.getUserPersonalProjects(username)
      .then((result) => {
        commit('setList', result);
      });
  },

  getProjectsByIds({ commit }, projectIds) {
    return projectService.getProjects(projectIds)
      .then((result) => {
        commit('setList', result);
      });
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return projectService.getTeamProjectListing(teamId)
      .then((result) => {
        commit('setList', result);
      });
  },

  // tenant

  getTenantProjects({ commit }, { tenantId }) {
    return projectService.getTenantProjectListing(tenantId)
      .then((result) => {
        commit('setList', result);
      });
  },

  // one

  getProjectDetails({ commit }, projectId) {
    return projectService.getProject(projectId)
      .then((result) => {
        commit('setOne', result);
      });
  },

  getTeamDefaultProject(_, teamId) {
    return projectService.getTeamDefaultProject(teamId);
  },

  create({ commit }, payload) {
    const {
      creator: { privKey },
      data: {
        teamId,
        creator,
        domains,
        isPrivate,
        members,
        inviteLifetime,
        reviewShare,
        compensationShare,
        attributes,
        memoKey,
        formData
      },
      proposal: {
        isProposal,
        isProposalApproved,
        proposalLifetime
      }
    } = payload;

    return projectService.createProject(
      { privKey },
      {
        teamId,
        creator,
        domains,
        isPrivate,
        members,
        inviteLifetime,
        reviewShare,
        compensationShare,
        attributes,
        memoKey,
        formData
      },
      { isProposal, isProposalApproved, proposalLifetime }
    )
      .then((result) => {
        commit('setOne', result);
      });
  },

  update({ commit }, payload) {
    const {
      creator: { privKey },
      data: {
        projectId,
        teamId,
        isPrivate,
        members,
        inviteLifetime,
        reviewShare,
        compensationShare,
        updater,
        attributes,
        formData
      },
      proposal: {
        isProposal,
        isProposalApproved,
        proposalLifetime
      }
    } = payload;

    return projectService.updateProject(
      { privKey },
      {
        projectId,
        teamId,
        isPrivate,
        members,
        inviteLifetime,
        reviewShare,
        compensationShare,
        updater,
        attributes,
        formData
      },
      { isProposal, isProposalApproved, proposalLifetime }
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
