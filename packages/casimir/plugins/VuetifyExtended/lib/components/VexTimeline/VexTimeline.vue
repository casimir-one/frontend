<template>
  <v-sheet>
    <slot />
  </v-sheet>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';
  /**
   * Component for display a vertical timeline.
   * Should contain at least one vex-timeline-item
   */
  export default defineComponent({
    name: 'VexTimeline'
  });
</script>
