<template>
  <v-row no-gutters :class="classes">
    <v-col cols="auto">
      <div v-if="!hasSlot('label')" class="text-caption">
        {{ label }}
      </div>
      <slot name="label" />
    </v-col>
    <v-divider class="dotted align-self-end mx-1" style="margin-bottom: 2px;" />
    <v-col cols="auto">
      <div v-if="!hasSlot('value')" class="text-caption font-weight-medium">
        {{ value }}
      </div>
      <slot name="value" />
    </v-col>
    <v-col v-if="hasSlot('secondRow')" cols="12">
      <slot name="secondRow" />
    </v-col>
  </v-row>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { contextMixin } from '../../composables';

  /**
   * Dot list item
   */
  export default defineComponent({
    name: 'VexDotListItem',
    mixins: [contextMixin],
    props: {
      /** Item label */
      label: {
        type: [String, Number],
        default: null
      },
      /** Item value */
      value: {
        type: [String, Number],
        default: null
      },
      /**
       * Label and velut align
       * @see See [Flex align](https://vuetifyjs.com/en/styles/flex/#flex-align)
       * @values start, end, center, baseline, stretch,
       * sm-start, sm-end, sm-center, sm-baseline, sm-stretch
       * md-start, md-end, md-center, md-baseline, md-stretch
       * lg-start, lg-end, lg-center, lg-baseline, lg-stretch
       * xl-start, xl-end, xl-center, xl-baseline, xl-stretch
       */
      align: {
        type: String,
        default: null
      }
    },
    computed: {
      classes() {
        return {
          ...(this.align ? { [`align-${this.align}`]: true } : {})
        };
      }
    }
  });
</script>
