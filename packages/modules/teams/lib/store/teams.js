import { TeamService } from '@deip/team-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-store';

const teamService = TeamService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ commit }, payload = {}) {
    let getListPromise = teamService.getTeamsListing();

    if (payload.teams && payload.teams.length > 0) {
      getListPromise = teamService.getTeams(payload.teams);
    }

    return getListPromise
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getTeamsByUser({ commit }, username) {
    return teamService.getTeamsByUser(username)
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
    return teamService
      .createTeam(payload)
      .then((res) => {
        const { entityId } = res;

        dispatch('getOne', entityId);

        return res;

        // XXX: invites functionality is not ready
        // const invites = members
        //   .filter((m) => m.account.name !== creator.username)
        //   .map((m) => ({
        //     account: m.account.name,
        //     rgt: m.stake * DEIP_1_PERCENT,
        //     notes: ''
        //   }));

        // const invitesPromises = invites.map((invitee) => teamService.createResearchGroupInvite(
        //   { privKey: this.user.privKey, username: this.user.username },
        //   {
        //     researchGroup: teamId,
        //     member: invitee.account,
        //     rewardShare: '0.00 %',
        //     researches: [],
        //     extensions: []
        //   },
        //   {
        //     notes: `${name} invites you to join them`
        //   }
        // ));

        // return Promise.all(invitesPromises)
        //   .then((result) => ({
        //     team,
        //     invites: result
        //   }))
        //   .catch((err) => {
        //     console.error(err);
        //   });
      });
  },

  update({ dispatch }, payload) {
    return teamService
      .updateTeam(payload)
      .then((res) => {
        const { entityId } = res;

        dispatch('getOne', entityId);

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
