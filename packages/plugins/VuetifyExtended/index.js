import VexStack from './lib/components/VexStack/VexStack';
import VexPasswordInput from './lib/components/VexPasswordInput/VexPasswordInput';

import VexNotifierPlugin from './lib/components/VexNotifier';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  // simple components

  Vue.component('VexStack', VexStack);
  Vue.component('VexPasswordInput', VexPasswordInput);

  // dynamic components

  Vue.use(VexNotifierPlugin);


};

const VuetifyExtended = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VuetifyExtended);
}

export { VuetifyExtended };
