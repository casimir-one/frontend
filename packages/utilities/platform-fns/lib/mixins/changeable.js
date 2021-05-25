import { cloneDeep, isEqual } from 'lodash/fp';

const stabilizeJson = (obj) => JSON.parse(JSON.stringify(obj));

export const changeable = {
  name: 'changeable',
  data() {
    return {
      _compareCache: undefined
    };
  },
  methods: {
    $$storeCache(data) {
      this._compareCache = { ...cloneDeep(data) };
    },

    $$isChanged(data) {
      const a = cloneDeep(data);
      const b = this._compareCache;

      if (this._compareCache) {
        return !isEqual(stabilizeJson(a), stabilizeJson(b));
      }
      return false;
    }
  }
};
