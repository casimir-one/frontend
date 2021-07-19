// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';

export function defineComponent(options) {
  if (!options.name) {
    console.warn('[defineComponent]: The component is missing an explicit name');
    return options;
  }

  return Vue.extend(options);
}
