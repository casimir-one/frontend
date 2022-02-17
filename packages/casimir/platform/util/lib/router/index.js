/**
 * Basic Vue component with router-view
 */
export const routerView = { template: '<router-view />' };

/**
 * Stub for page in development
 */
export const inDevelopmentView = { template: '<div>In development...</div>' };

/**
 * Route name generator
 * @param {string} namespace
 * @param {string} parent
 * @returns {Object} result
 * @returns {Function} result.get
 */
export const routeNameGenerator = (namespace, parent) => ({
  /**
   * Generate route name
   * @param {string} name
   * @returns {string}
   */
  get(name) {
    return [
      ...(parent ? [parent] : []),
      namespace,
      ...(name ? [name] : [])
    ].join('.');
  }
});
