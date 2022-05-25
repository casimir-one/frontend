import { get } from 'lodash';
import { NonFungibleTokenService } from '@casimir/token-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

const nonFungibleTokenService = NonFungibleTokenService.getInstance();

const actionsMap = {
  projects: {
    public: {
      all: 'getPublicProjects'
    },
    user: {
      all: 'getUserProjects',
      following: 'getProjectsByIds',
      public: 'getUserPublicProjects'
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
    return nonFungibleTokenService.getPublicNftCollectionsList(filter)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // user

  getUserProjects({ commit }, { username }) {
    return nonFungibleTokenService.getNftCollectionsListByIssuer(username)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getUserPublicProjects({ commit }, { username }) {
    return nonFungibleTokenService.getNftCollectionsListByIssuer(username)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getProjectsByIds({ commit }, projectIds) {
    return nonFungibleTokenService.getNftCollectionsListByIds(projectIds)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // team

  getTeamProjects({ commit }, { teamId }) {
    return nonFungibleTokenService.getNftCollectionsListByIssuer(teamId)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // portal

  getPortalProjects({ commit }, { portalId }) {
    return nonFungibleTokenService.getPortalNftCollectionList(portalId)
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  // one

  getOne({ commit }, projectId) {
    return nonFungibleTokenService.getNftCollection(projectId)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  async getTeamDefaultProject(_, teamId) {
    const res = await nonFungibleTokenService.getDefaultNftCollectionByIssuer(teamId);
    return res.data;
  },

  async create({ dispatch }, payload) {
    const res = await nonFungibleTokenService.create({
      ...payload
    });

    dispatch('getOne', res.data._id);
    return res.data;
  },

  async update({ dispatch }, payload) {
    const res = await nonFungibleTokenService.updateNftCollectionMetadata({
      ...payload
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
