export const routerView = { template: '<router-view />' };

export const routeNameGenerator = (namespace, parent) => ({
  get(name) {
    return [
      ...(parent ? [parent] : []),
      namespace,
      ...(name ? [name] : [])
    ].join('.');
  }
});
