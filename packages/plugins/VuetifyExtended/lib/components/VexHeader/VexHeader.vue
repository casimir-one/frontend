<template>
  <v-sheet class="vex-header">
    <div
      v-if="backgroundImage"
      class="vex-header__image-wrapper"
    >
      <v-img
        class="vex-header__image"
        :src="backgroundImage"
      />
    </div>
    <div
      class="vex-header__overlay"
      :style="overlayStyles"
    />
    <vex-section class="vex-header__content" dark>
      <slot v-bind="slotBinds" />
    </vex-section>
  </v-sheet>
</template>

<script>
  import { defineComponent } from '@deip/platform-fns';
  import { getDominantColor, isDarkColor } from '@deip/toolbox';
  import { VexSection } from '../VexSection';

  export default defineComponent({
    name: 'VexHeader',

    components: {
      VexSection
    },

    props: {
      backgroundImage: {
        type: String,
        default: null
      },
      backgroundVideo: {
        type: String,
        default: null
      },
      overlay: {
        type: String,
        default: 'rgba(0, 0, 0, .6)'
      },
      returnDominant: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        dominantColor: null
      };
    },

    computed: {
      overlayStyles() {
        return {
          ...(this.overlay ? {
            background: this.overlay
          } : {})
        };
      },

      imageIsDark() {
        return this.dominantColor
          ? isDarkColor(this.dominantColor)
          : false;
      },

      slotBinds() {
        return {
          ...(this.dominantColor && this.returnDominant
            ? {
              imageDominant: this.dominantColor,
              imageIsDark: this.imageIsDark
            }
            : {}
          )
        };
      }
    },

    created() {
      this.getDominantColor();
    },

    methods: {
      getDominantColor() {
        if (this.backgroundImage && this.returnDominant) {
          getDominantColor(this.backgroundImage)
            .then((color) => {
              this.dominantColor = color;
            });
        }
      }
    }
  });
</script>

<style lang="scss">
  .vex-header {
    position: relative;

    &__image-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    &__image {
      height: 100%;
    }

    &__overlay {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    &__content {
      position: relative;
      z-index: 3;
    }
  }
</style>
