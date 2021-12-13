<template>
  <div :class="$style.host" :style="cssVars">
    <slot />
  </div>
</template>

<script>
  // TODO: refactorin to VSheet renderer
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  /* eslint-enable */

  export default defineComponent({
    name: 'VexGrid',
    props: {
      itemMaxWidth: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      cssVars() {
        if (this.itemMaxWidth) {
          return {
            '--vex-grid-item-max-width': convertToUnit(this.itemMaxWidth)
          };
        }
        return false;
      }
    }
  });
</script>

<style module lang="scss">
  .host {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--vex-grid-item-max-width, 280px), 1fr));
    grid-gap: 1.5rem;
  }
</style>
