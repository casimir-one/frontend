import { teamsRouter } from './router';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router } = options;

  if (router) {
    for (const route of teamsRouter) {
      router.addRoute(route);
    }
  } else {
    throw Error('[TestAppTeamsModule]: router istance is not provided');
  }
};

export const TestAppTeamsModule = {
  name: 'TestAppTeamsModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'TeamsModule'
  ],
  install
};
