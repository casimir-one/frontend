import { accountRouter } from '@/modules/account/router';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router } = options;

  if (router) {
    for (const route of accountRouter) {
      router.addRoute(route);
    }
  } else {
    throw Error('[TestAppAccountModule]: router instance is not provided');
  }
};

export const TestAppAccountModule = {
  name: 'TestAppAccountModule',
  deps: [
    'EnvModule',
    'UsersModule'
  ],
  install
};
