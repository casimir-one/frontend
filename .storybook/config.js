import {configure, addDecorator, addParameters} from '@storybook/vue';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';

import vuetifyConfig from './vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.css'

addDecorator(() => ({
  vuetify: vuetifyConfig,
  template: '<v-app><v-content class="pa-4"><story/></v-content></v-app>'
}));

const newViewports = {
  // example: {
  //   name: 'example',
  //   styles: {
  //     width: '600px',
  //     height: '963px',
  //   },
  // }
};

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...newViewports,
    },
  },
});

const req = require.context('../packages', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
