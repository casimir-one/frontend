<template>
  <div>
    <div :class="textClasses" :style="textStyles">
      <slot />
    </div>

    <span
      class="primary--text font-weight-medium d-inline-block mt-2 cursor-pointer"
      @click="handleClick"
    >
      {{ isExpanded ? 'Hide' : 'Show all' }}
    </span>
  </div>
</template>

<script>
  import { convertToUnit } from '@deip/toolbox';

  export default {
    name: 'VexTextExpand',
    props: {
      maxHeight: {
        type: [String, Number],
        default: 100
      }
    },

    data() {
      return {
        isExpanded: false
      };
    },

    computed: {
      textClasses() {
        return {
          'overflow-hidden': true,
          gradient: !this.isExpanded
        };
      },
      textStyles() {
        const maxHeight = this.isExpanded ? 'none' : convertToUnit(this.maxHeight);
        return { maxHeight };
      }
    },

    methods: {
      handleClick() {
        this.isExpanded = !this.isExpanded;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .cursor-pointer {
    cursor: pointer;
  }

  .gradient {
    -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  }
</style>
