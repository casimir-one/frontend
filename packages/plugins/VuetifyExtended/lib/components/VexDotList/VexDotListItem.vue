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
  import { contextMixin } from '../../composables';

  export default {
    name: 'VexDotListItem',
    mixins: [contextMixin],
    props: {
      label: {
        type: [String, Number],
        default: null
      },
      value: {
        type: [String, Number],
        default: null
      },
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
  };
</script>
