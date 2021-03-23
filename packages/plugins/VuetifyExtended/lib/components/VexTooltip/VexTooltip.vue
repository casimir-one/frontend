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
  import { VTooltip } from 'vuetify/lib/components';
  import { getBindableProps } from '../../composables/props';

  export default {
    name: 'VexTooltip',
    props: {
      tooltip: {
        type: String,
        default: undefined
      },
      tag: {
        type: String,
        default: 'span'
      },

      ...VTooltip.options.props,
    },
    computed: {
      componentProps() {
        return getBindableProps.call(this, VTooltip.options.props)
      }
    }
  };
</script>
