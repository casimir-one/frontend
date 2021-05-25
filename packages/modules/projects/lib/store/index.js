import { get } from 'lodash/fp';

import { ResearchService } from '@deip/research-service';
import { ProjectService } from '@deip/project-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns';

const researchService = ResearchService.getInstance();
const projectService = ProjectService.getInstance();

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
    return projectService.getProject(projectId)
      .then((result) => {
        commit('setOne', result);
      });
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
