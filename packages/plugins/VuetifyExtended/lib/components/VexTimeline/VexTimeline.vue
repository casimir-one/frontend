<template>
  <v-sheet>
    <slot />
  </v-sheet>
</template>

<script>
  import { defineComponent } from '@deip/platform-fns';

  export default defineComponent({
    name: 'VexTimeline'
  });
</script>
