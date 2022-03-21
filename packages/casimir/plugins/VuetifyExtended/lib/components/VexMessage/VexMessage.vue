<template>
  <v-sheet rounded class="text-body-2 message pa-6">
    <vex-text-expand v-if="expandable" max-height="80">
      <slot />
    </vex-text-expand>

    <slot v-else />
  </v-sheet>
</template>

<script>
  import { VexTextExpand } from '../VexTextExpand';
  /**
   * Сomponent for displaying a message for the user, highlighted in color
   */
  export default {
    name: 'VexMessage',
    components: { VexTextExpand },

    props: {
      /**
       * Hide some text
       * default: false
       */
      expandable: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  .message {
    background-color: var(--v-primary-hover); // custom var --v-primary-hover
  }
</style>
