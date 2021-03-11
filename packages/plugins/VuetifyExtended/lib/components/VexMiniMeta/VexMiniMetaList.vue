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
  import VexMiniMetaItem from './VexMiniMetaItem';
  import VexStack from '../VexStack/VexStack';

  console.log(VexStack)

  import { getBindableProps } from '../../composables/props';

  export default {
    name: 'VexMiniMetaList',
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
        return getBindableProps.call(this, VexStack.props)
      }
    }
  };
</script>
