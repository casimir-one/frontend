// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';

/**
 * Create a “subclass” of the base Vue constructor
 * @param {Object} options
 * @returns {Function} component constructor
 */
export function defineComponent(options) {
  if (!options.name) {
    console.warn('[defineComponent]: The component is missing an explicit name');
    return options;
  }

  return Vue.extend(options);
}
