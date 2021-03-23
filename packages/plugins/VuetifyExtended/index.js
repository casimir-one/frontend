import VexNotifierPlugin from './lib/components/VexNotifier';
import VexDialogPlugin from './lib/components/VexDialog';

import VexStack from './lib/components/VexStack/VexStack';
import VexGrid from './lib/components/VexGrid/VexGrid';
import VexPasswordInput from './lib/components/VexPasswordInput/VexPasswordInput';
import VexMiniMetaItem from './lib/components/VexMiniMeta/VexMiniMetaItem';
import VexMiniMetaList from './lib/components/VexMiniMeta/VexMiniMetaList';
import VexSection from './lib/components/VexSection/VexSection';
import VexSectionSplit from './lib/components/VexSection/VexSectionSplit';
import VexSectionTitle from './lib/components/VexSection/VexSectionTitle';
import VexImageInput from './lib/components/VexImageInput/VexImageInput';
import VexCroppa from './lib/components/VexCroppa/VexCroppa';
import VexAutocomplete from './lib/components/VexAutocomplete/VexAutocomplete';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  // simple components

  Vue.component('VexStack', VexStack);
  Vue.component('VexSection', VexSection);
  Vue.component('VexSectionTitle', VexSectionTitle);
  Vue.component('VexSectionSplit', VexSectionSplit);
  Vue.component('VexGrid', VexGrid);
  Vue.component('VexMiniMeta', VexMiniMetaItem);
  Vue.component('VexMiniMetaList', VexMiniMetaList);
  Vue.component('VexPasswordInput', VexPasswordInput);
  Vue.component('VexImageInput', VexImageInput);
  Vue.component('VexCroppa', VexCroppa);
  Vue.component('VexAutocomplete', VexAutocomplete);

  // dynamic components

  const {
    vexNotifier,
    vexDialog,
    vuetify
  } = options;

  if (!vuetify) {
    console.warn('VuetifyExtended needs vuetify instance. Use Vue.use(VuetifyExtended, { vuetify })');
  }

  Vue.use(VexNotifierPlugin, { vuetify, ...vexNotifier});
  Vue.use(VexDialogPlugin, { vuetify, ...vexDialog});
};

export const VuetifyExtended = {
  name: 'VuetifyExtended',
  install
};
