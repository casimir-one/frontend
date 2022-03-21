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
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import { VIcon } from 'vuetify/lib/components';
  /* eslint-enable */

  /**
   * Component renders one element for VexMiniMeta
   */
  export default defineComponent({
    name: 'VexMiniMetaItem',
    components: { VIcon },
    props: {
      /**
       * Data object to display
       * Contains a label icon and a title
       * Takes precedence over properties with the same name
       */
      meta: {
        type: Object,
        default: () => ({})
      },
      /** Icon name
       * @see see [icon pack](https://materialdesignicons.com/)
       */
      icon: {
        type: String,
        default: null
      },
      /** Item Label */
      label: {
        type: String,
        default: null
      },
      /** Item Title */
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
