<template>
  <v-sheet>
    <slot />
  </v-sheet>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'VexTimeline'
  });
</script>
