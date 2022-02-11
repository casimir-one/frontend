export const getRouterNames = (routes) => routes.reduce((acc, route) => [
  ...acc,
  route.name,
  ...(route.children ? getRouterNames(route.children) : [])
], []).filter((r) => !!r);
