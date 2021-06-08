import { hasValue } from '@deip/toolbox';

export const awaitForStore = (store, getter) => new Promise((resolve) => {
  if (hasValue(store.getters[getter])) {
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
