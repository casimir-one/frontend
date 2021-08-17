<template>
  <v-sheet rounded class="pa-6 text-body-2 message">
    <vex-text-expand max-height="80">
      <slot />
    </vex-text-expand>
  </v-sheet>
</template>

<script>
  import { VexTextExpand } from '../VexTextExpand';

  export default {
    name: 'VexMessage',
    components: { VexTextExpand }
  };
</script>

<style lang="scss" scoped>
  .message {
    position: relative;

    &:before {
      opacity: 0.08;
      background-color: var(--v-primary-base);
      border-radius: inherit;
      bottom: 0;
      color: inherit;
      content: "";
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
