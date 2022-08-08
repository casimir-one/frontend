<template>
  <div
    :style="textStyles"
  >
    <slot />
  </div>
</template>

<script>
  /**
   * Сomponent allows you to scroll text
   */
  export default {
    name: 'VexScrollableText',

    props: {
      /**
       * Maximum height of scrollable text
       */
      maxHeight: {
        type: [String, Number],
        default: 100
      }
    },

    computed: {
      textStyles() {
        return {
          maxHeight: `${this.maxHeight}px`,
          overflow: 'auto'
        };
      }
    }
  };
</script>
