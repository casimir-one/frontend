import { investmentsRouter } from './router';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router } = options;

  if (router) {
    for (const route of investmentsRouter) {
      router.addRoute(route);
    }
  } else {
    throw Error('[TestAppInvestmentsModule]: router istance is not provided');
  }
};

export const TestAppInvestmentsModule = {
  name: 'TestAppInvestmentsModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'FundraisingModule'
  ],
  install
};
