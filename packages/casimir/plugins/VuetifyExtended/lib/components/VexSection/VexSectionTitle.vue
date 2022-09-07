<template>
  <div class="d-flex flex-wrap mt-n2">
    <div v-if="$slots.prepend" class="mt-2">
      <slot name="prepend" />
    </div>

    <template v-if="hasTitle">
      <div v-if="title || $slots.default" class="text-h3 mt-2">
        <v-badge
          color="primary"
          offset-y="12"
          offset-x="0"
          :content="titleBadge"
          :value="Boolean(titleBadge)"
        >
          {{ title }}
        </v-badge>

        <slot />
      </div>

      <slot name="title" />
    </template>

    <v-spacer />

    <div v-if="$slots.append" class="mt-2">
      <slot name="append" />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';

  /**
   * Component for displaying the section title
   */
  export default defineComponent({
    name: 'VexSectionTitle',
    props: {
      /** Text title */
      title: {
        type: [String],
        default: ''
      },
      /**
       * Any content you want injected
       * as text into the badge
       */
      titleBadge: {
        type: [String, Number],
        default: ''
      }
    },
    methods: {
      /**
       * Whether title is given
       * @returns {string} title or empty string
       */
      hasTitle() {
        return this.title || this.$slots.title;
      }
    }
  });
</script>
