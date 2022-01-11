<template>
  <ve-stack class="d-flex">
    <vex-mini-meta-item
      v-for="(item, index) of items"
      :key="index"
      :meta="item"
    />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VeStack } from '@deip/vue-elements';
  import VexMiniMetaItem from './VexMiniMetaItem';

  import { getBindableProps } from '../../composables';

  export default defineComponent({
    name: 'VexMiniMeta',
    components: { VeStack, VexMiniMetaItem },
    props: {
      items: {
        type: Array,
        default: () => ([])
      },

      ...VeStack.options.props
    },
    computed: {
      stackProps() {
        return getBindableProps.call(this, VeStack.options.props);
      }
    }
  });
</script>
