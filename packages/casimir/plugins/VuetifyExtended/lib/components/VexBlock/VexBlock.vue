<template>
  <ve-stack :gap="titleMarginComputed">
    <div v-if="hasHeader" :class="headerClassList">
      <slot name="title-prepend" />

      <div class="spacer">
        <div
          v-if="hasTitle"
          :class="titleClassList"
        >
          {{ title }}
          <slot name="title" />
        </div>

        <div
          v-if="hasSubtitle"
          :class="subtitleClassList"
        >
          {{ subtitle }}
          <slot name="subtitle" />
        </div>
      </div>
      <div v-if="hasSlot('title-append')" :class="$style.actions">
        <slot name="title-append" />
      </div>
    </div>

    <slot />
  </ve-stack>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';
  import { VeStack } from '@casimir/vue-elements';
  import { contextMixin } from '../../composables';

  /**
   * Container for data with title
   */
  export default defineComponent({
    name: 'VexBlock',
    components: { VeStack },
    mixins: [contextMixin],
    props: {
      /** Compact format */
      compact: {
        type: Boolean,
        default: false
      },
      /** Title margin */
      titleMargin: {
        type: [Number, String],
        default: 24
      },
      /** Title */
      title: {
        type: String,
        default: null
      },
      /** Subtitle */
      subtitle: {
        type: String,
        default: null
      }
    },
    computed: {
      /** Block has title */
      hasTitle() {
        return !!this.title || this.hasSlot('title');
      },
      /** Block has subtitle */
      hasSubtitle() {
        return !!this.subtitle || this.hasSlot('subtitle');
      },
      /** Has header */
      hasHeader() {
        return this.hasTitle || this.hasSubtitle;
      },
      /** Computed title margin */
      titleMarginComputed() {
        return this.compact ? 16 : this.titleMargin;
      },
      /** Title classes */
      titleClassList() {
        return {
          'text-h6': this.compact,
          'text-h5': !this.compact,
          'vex-block-title': true
        };
      },
      /** Header classes */
      headerClassList() {
        return {
          'd-flex': true,
          'align-center': true,
          'vex-block-header': true
        };
      },
      /** Subtitle classes */
      subtitleClassList() {
        return {
          'text-body-2': true,
          'text--secondary': true,
          'vex-block-subtitle': true
        };
      }
    }
  });
</script>

<style lang="scss" module>
  .actions {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
  }
</style>
