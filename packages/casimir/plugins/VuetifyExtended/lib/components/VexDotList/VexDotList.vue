<template>
  <ve-stack :gap="8">
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
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';
  import { VeStack } from '@casimir.one/vue-elements';
  import VexDotListItem from './VexDotListItem';
  import { contextMixin } from '../../composables';

  /**
   * List with dots aside
   */
  export default defineComponent({
    name: 'VexDotList',
    components: {
      VeStack,
      VexDotListItem
    },
    mixins: [contextMixin],
    props: {
      /** Items */
      items: {
        type: Array,
        default: () => ([])
      },
      /**
       * Row align
       * @see See [Flex align](https://vuetifyjs.com/en/styles/flex/#flex-align)
       * @values start, end, center, baseline, stretch,
       * sm-start, sm-end, sm-center, sm-baseline, sm-stretch
       * md-start, md-end, md-center, md-baseline, md-stretch
       * lg-start, lg-end, lg-center, lg-baseline, lg-stretch
       * xl-start, xl-end, xl-center, xl-baseline, xl-stretch
       */
      rowAlign: {
        type: String,
        default: null
      }
    }
  });
</script>
