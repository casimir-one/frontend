import {storiesOf} from '@storybook/vue'
import {withKnobs, text, boolean} from '@storybook/addon-knobs';

import {{ componentName }} from './{{componentName}}';

const stories = storiesOf('{{componentName}}', module);

stories.addDecorator(withKnobs);

stories.add('default', () => ({
  components: {
      {{componentName}}
  },
  template: `<{{componentCallName}} :text="text"></{{componentCallName}}>`,
  props: {
    text: {
      default: text('Text', 'Hello')
    }
  }
}));
