import { ResearchGroupService } from '@deip/research-group-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-fns/lib/store';

const teamsService = ResearchGroupService.getInstance(); // TODO: need service rename

// start temp
const DEIP_1_PERCENT = 10000 / 100;
const toAssetUnits = (
  amount,
  precision = 3,
  asset = 'TESTS'
) => {
  let value = parseFloat(amount).toFixed(precision);
  return `${value} ${asset}`;
}
// end temp

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  get({ commit }) {
    return teamsService
      .getResearchGroupsListing()
      .then((res) => {
        commit('setList', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getOne({ commit }, payload) {
    return teamsService
      .getResearchGroup(payload)
      .then((res) => {
        commit('setOne', res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  create({ commit, dispatch }, payload) {

    const {
      name,
      description,
      members,
      creator
    } = payload;

    const auth = {
      account_auths: [[creator.username, 1]],
      key_auths: [],
      weight_threshold: 1
    };

    return teamsService
      .createResearchGroup(
        creator.privKey,
      {
        fee: toAssetUnits(0),
        creator: creator.username,
        accountOwnerAuth: auth,
        accountActiveAuth: auth,
        accountMemoPubKey: creator.account.memo_key,
        accountJsonMetadata: undefined,
        accountExtensions: []
      },
      {
        researchGroupName: name,
        researchGroupDescription: description,
        researchGroupThresholdOverrides: []
      }
    ).then((team) => {
        dispatch('get');

        const { 'external_id': teamId } = team;

        // TODO: rethink and use getUsers?
        const invites = members
          .filter((m) => m.account.name !== creator.username)
          .map((m) => ({
            account: m.account.name,
            rgt: m.stake * DEIP_1_PERCENT,
            notes: ''
          }));

        const invitesPromises = invites.map((invitee) => teamsService.createResearchGroupInvite(
          { privKey: this.user.privKey, username: this.user.username },
          {
            researchGroup: teamId,
            member: invitee.account,
            rewardShare: '0.00 %',
            researches: [],
            extensions: []
          },
          {
            notes: `${name} invites you to join them`
          }
        ));

        return Promise.all(invitesPromises)
          .then((invites) => {
            return {
              team,
              invites
            }
          })
          .catch((err) => {
            console.error(err);
          });

      })
      .catch((err) => {
        console.error(err);
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
}
