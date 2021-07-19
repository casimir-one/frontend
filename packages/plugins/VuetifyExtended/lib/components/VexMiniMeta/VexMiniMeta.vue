<template>
  <vex-stack class="d-flex">
    <vex-mini-meta-item
      v-for="(item, index) of items"
      :key="index"
      :meta="item"
    />
  </vex-stack>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import VexMiniMetaItem from './VexMiniMetaItem';
  import VexStack from '../VexStack/VexStack';

  import { getBindableProps } from '../../composables';

  export default defineComponent({
    name: 'VexMiniMeta',
    components: { VexStack, VexMiniMetaItem },
    props: {
      items: {
        type: Array,
        default: () => ([])
      },

      ...VexStack.props
    },
    computed: {
      stackProps() {
        return getBindableProps.call(this, VexStack.props);
      }
    }
  });
</script>
