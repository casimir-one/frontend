import { projectsRouter } from './router';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router } = options;

  if (router) {
    for (const route of projectsRouter) {
      router.addRoute(route);
    }
  } else {
    throw Error('[TestAppProjectsModule]: router istance is not provided');
  }
};

export const TestAppProjectsModule = {
  name: 'TestAppProjectsModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'ProjectsModule',
    'InvestmentOpportunitiesModule'
  ],
  install
};
