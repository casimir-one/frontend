import { VexDialog } from '../components';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const property = options.property || '$confirm';
  const { vuetify } = options;

  if (!vuetify) {
    console.warn('VexDialog needs vuetify instance. Use Vue.use(VexDialog, { vuetify })');
  }

  Vue.delete(options, 'property');
  Vue.delete(options, 'vuetify');

  function createDialogCmp(opts) {
    const container = document.querySelector('[data-app=true]') || document.body;

    return new Promise((resolve) => {
      const cmp = new VexDialog({
        vuetify,
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
};

export const Confirm = {
  install
};
