<template>
  <vex-stack :gap="titleMarginComputed">
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
  </vex-stack>
</template>

<script>
  import { VexStack } from '../VexStack';
  import { contextMixin } from '../../composables';

  export default {
    name: 'VexBlock',
    components: { VexStack },
    mixins: [contextMixin],
    props: {
      compact: {
        type: Boolean,
        default: false
      },
      titleMargin: {
        type: [Number, String],
        default: 24
      },

      title: {
        type: String,
        default: null
      },
      subtitle: {
        type: String,
        default: null
      }
    },
    computed: {
      hasTitle() {
        return !!this.title || this.hasSlot('title');
      },
      hasSubtitle() {
        return !!this.subtitle || this.hasSlot('subtitle');
      },
      hasHeader() {
        return this.hasTitle || this.hasSubtitle;
      },

      titleMarginComputed() {
        return this.compact ? 16 : this.titleMargin;
      },

      titleClassList() {
        return {
          'text-h6': this.compact,
          'text-h5': !this.compact,
          'vex-block-title': true
        };
      },
      headerClassList() {
        return {
          'd-flex': true,
          'align-center': true,
          'vex-block-header': true
        };
      },

      subtitleClassList() {
        return {
          'text-body-2': true,
          'text--secondary': true,
          'vex-block-subtitle': true
        };
      }
    }
  };
</script>

<style lang="scss" module>
  .actions {
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
  }
</style>
