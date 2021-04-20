<template>
  <vex-stack :gap="8">
    <slot>
      <vex-dot-list-item
        v-for="(item, index) of items"
        :key="index"
        :label="item.label"
        :value="item.value"
        :align="rowAlign"
      >
        <template v-if="hasSlot('label')" #label>
          <slot name="label" :item="item" />
        </template>

        <template v-if="hasSlot('value')" #value>
          <slot name="value" :item="item" />
        </template>

        <template v-if="hasSlot('secondRow')" #secondRow>
          <slot name="secondRow" :item="item" />
        </template>
      </vex-dot-list-item>
    </slot>
  </vex-stack>
</template>

<script>
  import VexDotListItem from './VexDotListItem';
  import { VexStack } from '../VexStack';
  import { contextMixin } from '../../composables';

  export default {
    name: 'VexDotList',
    components: {
      VexStack,
      VexDotListItem
    },
    mixins: [contextMixin],
    props: {
      items: {
        type: Array,
        default: () => ([])
      },
      rowAlign: {
        type: String,
        default: null
      }
    }
  };
</script>
