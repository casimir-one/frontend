const defaultAppBar = () => ({
  isVisible: true,
  disabled: false,
  type: 'default'
});

const defaultSideBar = () => ({
  isVisible: true,
  disabled: false,
  type: 'default'
});

const STATE = {
  appBar: defaultAppBar(),
  sideBar: defaultSideBar()
};

const GETTERS = {
  appBar: (state) => state.appBar,
  sideBar: (state) => state.sideBar
};

const ACTIONS = {
  changeAppBarState({ commit }, payload) {
    commit('setAppBarState', payload);
  },
  resetAppBarState({ commit, state }) {
    const { isVisible } = state.appBar;
    commit('setAppBarState', { ...defaultAppBar(), ...{ isVisible } });
  },
  changeSideBarState({ commit }, payload) {
    commit('setSideBarState', payload);
  },
  resetSideBarState({ commit, state }) {
    const { isVisible } = state.sideBar;
    commit('setSideBarState', { ...defaultSideBar(), ...{ isVisible } });
  }
};

const MUTATIONS = {
  setAppBarState(state, payload) {
    state.appBar = {
      ...state.appBar,
      ...payload
    };
  },
  setSideBarState(state, payload) {
    state.sideBar = {
      ...state.sideBar,
      ...payload
    };
  }
};

export const layoutStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
