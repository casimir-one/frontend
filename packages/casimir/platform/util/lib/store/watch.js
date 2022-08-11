import { isNil } from '@casimir/toolbox';

/**
 * Wait until some value appears in getter
 * @param {Object} store
 * @param {string} getter
 * @returns {Promise}
 */
export const awaitForStore = (store, getter) => new Promise((resolve) => {
  if (!isNil(store.getters[getter])) {
    resolve(store.getters[getter]);
  }
  const unwatch = store.watch(
    (_, getters) => getters[getter],
    (value) => {
      if (value) {
        unwatch();
        resolve(value);
      }
    }
  );
});

/**
 * Watch current user username and dispatch actions on change
 * @param {Object} store
 * @param {string} getAction
 * @param {string} clearAction
 */
export const callForCurrentUser = (store, getAction, clearAction) => {
  store.dispatch(getAction);

  store.watch((_, getters) => getters['auth/username'], (username) => {
    if (username) {
      store.dispatch(getAction);
    } else if (!username && clearAction) {
      store.dispatch(clearAction);
    }
  });
};
