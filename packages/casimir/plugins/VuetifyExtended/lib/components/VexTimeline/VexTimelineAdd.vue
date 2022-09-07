<template>
  <v-hover v-slot="{hover}">
    <button
      type="button"
      style="outline: 0"
      class="mt-1 d-inline-flex align-center"
      @click="handleClick"
    >
      <span :class="$style.icon" class="d-flex align-center justify-center">
        <v-icon small color="primary">
          {{ icon }}
        </v-icon>
      </span>
      <span
        class="text-caption font-weight-medium ml-4"
        :class="hover ? 'primary--text' : 'text--secondary'"
      >
        {{ label }}
      </span>
    </button>
  </v-hover>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';
  /**
   * Component for adding a new point on the timeline
   */
  export default defineComponent({
    name: 'VexTimelineAdd',
    props: {
      /**
       * Specify icon for dot container
       */
      icon: {
        type: String,
        default: 'mdi-plus'
      },
      /**
       * Label for button
       * @example 'Add item'
       */
      label: {
        type: String,
        default: 'Add item'
      }
    },
    methods: {
      /** Add new timeline */
      handleClick() {
        /** Click event */
        this.$emit('click');
      }
    }
  });
</script>

<style module lang="scss">
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid var(--v-primary-base);
  }
</style>
