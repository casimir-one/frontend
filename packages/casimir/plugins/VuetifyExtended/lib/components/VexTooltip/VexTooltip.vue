<template>
  <v-tooltip v-bind="componentProps">
    <template #activator="{ on }">
      <component :is="tag" v-on="on">
        <slot />
      </component>
    </template>
    <span v-if="tooltip">{{ tooltip }}</span>
    <slot name="tooltip" />
  </v-tooltip>
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';
  /* eslint-disable */
  import { VTooltip } from 'vuetify/lib/components';
  /* eslint-enable */
  import { getBindableProps } from '../../composables/props';
  /**
   * Component for tooltip
   */
  export default defineComponent({
    name: 'VexTooltip',
    props: {
      /** Tooltip text */
      tooltip: {
        type: String,
        default: undefined
      },
      /**  Tagname */
      tag: {
        type: String,
        default: 'span'
      },

      ...VTooltip.options.props
    },
    computed: {
      componentProps() {
        return getBindableProps.call(this, VTooltip.options.props);
      }
    }
  });
</script>
