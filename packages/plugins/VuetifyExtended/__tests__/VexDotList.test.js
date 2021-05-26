// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from '@vue/test-utils';

import { VexDotList, VexDotListItem } from '../lib/components/VexDotList';

describe('VexDotList', () => {
  const items = [
    {
      id: 1,
      label: 'Item 1'
    },
    {
      id: 2,
      label: 'Item 2'
    }
  ];

  it('should render simple dot list', () => {
    const wrapper = mount(VexDotList, {
      propsData: {
        items
      }
    });
    expect(wrapper.findAllComponents(VexDotListItem).length).toBe(2);
  });

  it('should render dot list with slots', () => {
    const wrapper = mount(VexDotList, {
      propsData: {
        items
      },
      scopedSlots: {
        label: '<span data-test-id="label-slot">{{props.item.label}}</span>',
        value: '<span data-test-id="value-slot">{{props.item.id}}</span>',
        secondRow: '<span data-test-id="second-row-slot">{{props.item.label}}</span>'
      }
    });

    expect(wrapper.findAll('[data-test-id="label-slot"]').length).toBe(2);
    expect(wrapper.findAll('[data-test-id="value-slot"]').length).toBe(2);
    expect(wrapper.findAll('[data-test-id="second-row-slot"]').length).toBe(2);
  });
});
