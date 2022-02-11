import { adminRouter } from './router';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router } = options;

  if (router) {
    for (const route of adminRouter) {
      router.addRoute(route);
    }
  } else {
    throw Error('[TestAppAdminModule]: routerInstance is not provided');
  }
};

export const TestAppAdminModule = {
  name: 'TestAppAdminModule',
  deps: ['EnvModule'],
  install
};
