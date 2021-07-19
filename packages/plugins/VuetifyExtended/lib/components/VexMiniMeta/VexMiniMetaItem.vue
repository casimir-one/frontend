<template>
  <div class="d-flex text-caption align-center">
    <v-icon v-if="internalIcon" class="mr-1" size="18">
      {{ internalIcon }}
    </v-icon>

    <div
      v-if="internalTitle"
      class="font-weight-medium mr-1"
    >
      {{ internalTitle }}
    </div>

    <div>
      <template v-if="internalLabel">
        {{ internalLabel }}
      </template>
      <slot />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-fns';
  /* eslint-disable */
  import { VIcon } from 'vuetify/lib/components';
  /* eslint-enable */

  export default defineComponent({
    name: 'VexMiniMetaItem',
    components: { VIcon },
    props: {
      meta: {
        type: Object,
        default: () => ({})
      },

      icon: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      }
    },
    computed: {
      internalIcon() {
        return this.meta.icon || this.icon;
      },
      internalTitle() {
        return this.meta.title || this.title;
      },
      internalLabel() {
        return this.meta.label || this.label;
      }
    }
  });
</script>
