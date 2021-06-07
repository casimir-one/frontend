import { TeamService } from '@deip/team-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns/lib/store';

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

  getUserTeams({ commit }, username) {
    return teamService.getTeamsByUser(username)
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getCurrentUserTeams({ dispatch, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return dispatch('getUserTeams', rootGetters['auth/username']);
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
      attributes,
      formData,
      creator
    } = payload;

    return teamService
      .createTeam(
        { privKey: creator.privKey },
        {
          creator: creator.username,
          memoKey: creator.account.memo_key,
          attributes,
          formData
        }
      )
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
    const {
      teamId,
      updater,
      formData,
      attributes,
      proposalInfo: { isProposal, isProposalApproved, proposalLifetime }
    } = payload;

    return teamService
      .updateTeam(
        { privKey: updater.privKey },
        {
          teamId,
          creator: updater.username,
          attributes,
          formData
        },
        { isProposal, isProposalApproved, proposalLifetime }
      ).then(() => {
        dispatch('getOne', teamId);
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
