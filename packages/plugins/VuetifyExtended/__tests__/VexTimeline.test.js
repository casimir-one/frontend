// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import { VexTimeline, VexTimelineItem, VexTimelineAdd } from '../lib/components/VexTimeline';

describe('VexTimeline', () => {
  let vuetify;

  beforeAll(() => {
    vuetify = new Vuetify();
  });

  const TestComponent = {
    template: `
    <vex-timeline>
      <vex-timeline-item
        v-for="(item, index) of value"
        :key="index"
        :dot-top="16"
        :ctrl-height="48"
      >
        {{item.label}}
      </vex-timeline-item>
      <vex-timeline-add id="addButton" @click="addItem()" />
    </vex-timeline>`,
    components: {
      VexTimeline,
      VexTimelineItem,
      VexTimelineAdd
    },
    data() {
      return {
        value: [
          {
            id: 1,
            label: 'Item 1'
          }, {
            id: 2,
            label: 'Item 2'
          }
        ]
      };
    },
    methods: {
      addItem() {
        this.value.push({ id: undefined, label: 'New' });
      }
    }
  };

  it('should render timeline items', () => {
    const wrapper = mount(TestComponent, { vuetify });
    expect(wrapper.findAll('.v-list-item').length).toBe(2);
  });

  it('should add new timeline item', async () => {
    const wrapper = mount(TestComponent, { vuetify });
    await wrapper.find('#addButton').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.v-list-item').length).toBe(3);
  });
});
