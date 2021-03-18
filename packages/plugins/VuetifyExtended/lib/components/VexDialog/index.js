import VexDialog from './VexDialog';
import { proxydi } from '@deip/proxydi';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const property = options.property || '$confirm';

  const vuetify = proxydi.get('vuetifyInstance');

  if (!vuetify) {
    console.warn('Module vex-confirm needs vuetify instance. Use Vue.use(VeConfirm, { vuetify })');
  }

  Vue.delete(options, 'property');
  Vue.delete(options, 'vuetify');

  const Ctor = Vue.extend({ vuetify, ...VexDialog });

  function createDialogCmp(opts) {
    const container = document.querySelector('[data-app=true]') || document.body;

    return new Promise((resolve) => {
      const cmp = new Ctor({
        propsData: { ...Vue.prototype[property].options, ...opts },
        destroyed: () => {
          container.removeChild(cmp.$el);
          resolve(cmp.confirmValue);
        }
      });
      container.appendChild(cmp.$mount().$el);
    });
  }

  function showDialog(message, opts = {}) {
    const o = {
      ...opts,
      ...{
        message,
        value: true,
        confirm: true
      }
    };
    return createDialogCmp(o);
  }

  Vue.prototype[property] = showDialog;
  Vue.prototype[property].options = options || {};

  Vue.component('VexDialog', { vuetify, ...VexDialog });
};

const VexDialogPlugin = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VexDialogPlugin);
}

export default VexDialogPlugin;
export { VexDialog };
