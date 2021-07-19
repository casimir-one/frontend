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
  import { defineComponent } from '@deip/platform-fns';
  /* eslint-disable */
  import { VTooltip } from 'vuetify/lib/components';
  /* eslint-enable */
  import { getBindableProps } from '../../composables/props';

  export default defineComponent({
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

      ...VTooltip.options.props
    },
    computed: {
      componentProps() {
        return getBindableProps.call(this, VTooltip.options.props);
      }
    }
  });
</script>
