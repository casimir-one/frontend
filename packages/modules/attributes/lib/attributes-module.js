const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push('AttributesModule');

};

export const AttributesModule = {
  name: 'AttributesModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',
    'EnvModule'
  ],
  install
};
