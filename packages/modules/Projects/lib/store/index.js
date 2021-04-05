import { ResearchService } from "@deip/research-service";
import { 
  getActionByPath,   
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
  },
};

const getAction = getActionByPath(actionsMap).get;

const STATE = {
  data: [],
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  // list
  getProjects({ dispatch }, payload = {}) {
    const target = [payload.scope];

    if (payload.userName) target.push('user');
    else if (payload.teamId) target.push('team');
    else if (payload.tenantId) target.push('tenant');
    else target.push('public');

    target.push(payload.type || 'all');

    return dispatch(getAction(target), payload);
  },

   // public

   getPublicProjects({ commit }, { filter = {} }) {
    return researchService.getPublicResearchListing(filter)
      .then((result) => {
        commit('setList', result);
      });
  },

  // user

  getUserProjects({ commit }, { userName }) {
    return researchService.getUserResearchListing(userName)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPublicProjects({ commit }, { userName }) {
    return researchService.getUserPublicProjects(userName)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserTeamsProjects({ commit }, { userName }) {
    return researchService.getUserTeamsProjects(userName)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserPersonalProjects({ commit }, { userName }) {
    return researchService.getUserPersonalProjects(userName)
      .then((result) => {
        commit('setList', result);
      });
  },

  getUserFollowingProjects({ commit, rootGetters }) {
    const ids = rootGetters['currentUser/data']   // TODO: fix after bookmarks module implemented
      .bookmarks
      .filter((b) => b.type === 'research')
      .map((b) => b.ref);

    return ids.length ? researchService.getResearches(ids)
      .then((result) => {
        commit('setList', result);
      }) : commit('setList', []);
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
}
