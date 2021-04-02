import { proxydi } from "@deip/proxydi";
import { projectsStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('projects', projectsStore);

  } else {
    throw Error('[ProjectsModule]: storeInstance is not provided');
  }
};

export const ProjectsModule = {
  name: 'ProjectsModule',
  deps: [
    'EnvModule',
    'UsersModule'
  ],
  install
};
