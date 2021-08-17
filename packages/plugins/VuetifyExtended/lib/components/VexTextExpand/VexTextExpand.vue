<template>
  <div>
    <div class="text-truncate" :style="textStyles">
      <slot />
    </div>

    <span
      class="primary--text font-weight-medium d-inline-block cursor-pointer mt-2 cursor-pointer"
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
</style>
