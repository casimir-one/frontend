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

  // dynamic components

  Vue.use(VexNotifierPlugin);
  Vue.use(VexDialogPlugin);


};

const VuetifyExtended = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VuetifyExtended);
}

export { VuetifyExtended };
