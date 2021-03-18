// NOTE: experiments! not for usage

export function crudActionsFabric(opts = {}) {
  const { getService, getOneService } = opts;

  return {
    ...(getService ? {
      get({ commit }) {
        return getService()
          .then((res) => {
            commit('setList', res);
          });
      }
    } : {}),

    ...(getOneService ? {
      getOne({ commit }, payload) {
        return getOneService(payload)
          .then((res) => {
            commit('setOne', res);
          });
      }
    } : {})
  }
}
