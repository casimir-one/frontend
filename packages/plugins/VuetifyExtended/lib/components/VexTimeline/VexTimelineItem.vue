<template>
  <v-list-item
    class="pa-0 reset-height rounded overflow-hidden"
    v-on="$listeners"
  >
    <v-sheet class="d-flex align-self-stretch flex-column align-center flex-shrink-0" :width="24" :min-height="40">
      <div :style="topLineStyle" class="mb-1" />
      <v-avatar
        :size="dotSize"
        :color="dotColor"
        class="d-flex flex-shrink-0 flex-grow-0"
        @click="onClickDot"
      >
        <slot name="dot">
          <v-icon small color="white">
            mdi-adjust
          </v-icon>
        </slot>
      </v-avatar>
      <div :style="bottomLineStyle" class="mt-1 flex-grow-1 flex-shrink-1" />
    </v-sheet>

    <v-list-item-content class="py-2 ml-4">
      <slot />
    </v-list-item-content>

    <v-list-item-action
      v-if="hasSlot('action')"
      class="d-flex align-self-start align-center ml-4 my-2"
      :style="{ height: ctrlHeight + 'px' }"
    >
      <slot name="action" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import { contextMixin } from '../../composables';

  export default {
    name: 'VexTimelineItem',
    mixins: [ contextMixin ],
    props: {
      dotTop: {
        type: Number,
        default: 4
      },
      dotSize: {
        type: Number,
        default: 24
      },
      dotColor: {
        type: String,
        default: 'primary'
      },

      ctrlHeight: {
        type: Number,
        default: 40
      },

      lineColor: {
        type: String,
        default: 'rgba(26, 27, 34, 0.12)'
      },
      topLineColor: {
        type: [String, Boolean],
        default: false
      },
      bottomLineColor: {
        type: [String, Boolean],
        default: false
      },

      lineWidth: {
        type: Number,
        default: 2
      }
    },

    computed: {
      topLineStyle() {
        return {
          minHeight: `${this.dotTop}px`,
          background: this.topLineColor ? this.topLineColor : this.lineColor,
          width: `${this.lineWidth}px`
        };
      },
      bottomLineStyle() {
        return {
          background: this.bottomLineColor ? this.bottomLineColor : this.lineColor,
          width: `${this.lineWidth}px`
        };
      }
    },

    methods: {
      onClickDot() {
        this.$emit('click:dot');
      }
    }
  };
</script>
