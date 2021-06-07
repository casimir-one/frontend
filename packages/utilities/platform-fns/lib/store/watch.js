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
