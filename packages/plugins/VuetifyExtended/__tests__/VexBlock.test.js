// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from '@vue/test-utils';

import { VexBlock } from '../lib/components/VexBlock';

describe('VexBlock', () => {
  it('should render title', () => {
    const wrapper = mount(VexBlock, {
      propsData: {
        title: 'Title'
      }
    });
    const title = wrapper.find('.vex-block-title');
    expect(title.text()).toBe('Title');
  });

  it('should render title slot', () => {
    const wrapper = mount(VexBlock, {
      slots: {
        title: '<div>Slot title</div>'
      }
    });
    const title = wrapper.find('.vex-block-title');
    expect(title.text()).toBe('Slot title');
  });

  it('should render subtitle', () => {
    const wrapper = mount(VexBlock, {
      propsData: {
        subtitle: 'Subtitle'
      }
    });
    const subtitle = wrapper.find('.vex-block-subtitle');
    expect(subtitle.text()).toBe('Subtitle');
  });

  it('should render subtitle slot', () => {
    const wrapper = mount(VexBlock, {
      slots: {
        subtitle: '<div>Slot subtitle</div>'
      }
    });
    const subtitle = wrapper.find('.vex-block-subtitle');
    expect(subtitle.text()).toBe('Slot subtitle');
  });

  it('should not render header', () => {
    const wrapper = mount(VexBlock);
    const header = wrapper.find('.vex-block-header');
    expect(header.exists()).toBe(false);
  });

  it('should render default slot', () => {
    const wrapper = mount(VexBlock, {
      slots: {
        default: '<div data-test-id="content">Slot content</div>'
      }
    });
    const subtitle = wrapper.find('[data-test-id="content"]');
    expect(subtitle.text()).toBe('Slot content');
  });
});
