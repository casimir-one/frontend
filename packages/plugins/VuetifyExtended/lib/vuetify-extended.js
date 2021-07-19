import { Confirm, Notifier } from './plugins';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    vexNotifier,
    vexDialog,
    vuetify,
    components,
    directives
  } = options;

  for (const name in components) {
    if (Object.prototype.hasOwnProperty.call(components, name)) {
      Vue.component(name, components[name]);
    }
  }

  for (const name in directives) {
    if (Object.prototype.hasOwnProperty.call(directives, name)) {
      Vue.directive(name, directives[name]);
    }
  }

  if (!vuetify) {
    console.warn('VuetifyExtended needs vuetify instance. Use Vue.use(VuetifyExtended, { vuetify })');
  }

  Vue.use(Confirm, { vuetify, ...vexDialog });
  Vue.use(Notifier, { vuetify, ...vexNotifier });
};

export const VuetifyExtended = {
  name: 'VuetifyExtended',
  install
};
