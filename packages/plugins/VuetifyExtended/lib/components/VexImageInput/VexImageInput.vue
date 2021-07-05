<template lang="html">
  <div v-if="ready">
    <div v-if="label" class="text-body-2 mb-1 text--secondary">
      {{ label }}
    </div>
    <v-sheet rounded class="overflow-hidden">
      <v-responsive
        :aspect-ratio="_aspectRatio"
      >
        <template v-if="mask && isInited && croppa.hasImage()">
          <!-- eslint-disable vue/no-v-html -->
          <div class="vex-mage-input__mask" v-html="mask" />
          <!-- eslint-enable -->
        </template>

        <vex-croppa
          ref="croppa"
          v-model="croppa"
          :accept="'image/*'"
          :prevent-white-space="true"
          :show-remove-button="false"
          :disable-scroll-to-zoom="true"
          :quality="croppaQuality"

          placeholder="Choose or drag-n-drop an image"
          :placeholder-font-size="14"
          placeholder-color="rgba(0,0,0,.5)"
          canvas-color="#F5F5F5"

          initial-size="cover"
          initial-position="center"
          auto-sizing
          :style="{width: '100%', height: '100%', display: 'block'}"
          :initial-image="checkedInitialImage"

          @init="onInit"

          @new-image-drawn="onNewImage"
          @draw="onDrawDebounce"
          @file-choose="onFileChoose"
          @initial-image-loaded="onInitialImageLoadedDebounce"
          @image-remove="onImageRemove"
        />
      </v-responsive>

      <template v-if="isInited">
        <v-divider />

        <v-sheet color="grey lighten-4 px-2 py-1 d-flex align-center">
          <template v-if="!noRotate">
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(1)">
              <v-icon>mdi-rotate-right</v-icon>
            </v-btn>
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(-1)">
              <v-icon>mdi-rotate-left</v-icon>
            </v-btn>
          </template>

          <template v-if="!noFlip">
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipX()">
              <v-icon>mdi-flip-horizontal</v-icon>
            </v-btn>
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipY()">
              <v-icon>mdi-flip-vertical</v-icon>
            </v-btn>
          </template>

          <div class="spacer mx-4">
            <v-slider
              v-model="sliderVal"
              :min="sliderMin"
              :max="sliderMax"
              :step="0.001"
              :hide-details="true"
              :disabled="!croppa.hasImage()"
              @input="onSliderInput"
            />
          </div>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.chooseFile()">
            <v-icon>mdi-sync</v-icon>
          </v-btn>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.remove()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-sheet>
      </template>
    </v-sheet>
  </div>
</template>

<script>
  import parsePath from 'parse-path';
  import mime from 'mime';

  // eslint-disable-next-line import/extensions,import/no-unresolved
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { debounce } from 'vuetify/lib/util/helpers';

  // import VexTooltip from '../VexTooltip/VexTooltip';
  import VexCroppa from '../VexCroppa/VexCroppa';

  const imageNameFromUrl = (url) => {
    const { pathname } = parsePath(url);
    return pathname.split('/').pop();
  };

  export default {
    name: 'VexImageInput',

    components: {
      // VexTooltip,
      VexCroppa
    },

    mixins: [Proxyable],

    props: {
      initialImage: {
        type: String,
        default: null
      },
      initialImageName: {
        type: String,
        default: null
      },

      aspectRatio: {
        type: [Number, String],
        default: 16 / 9
      },

      label: {
        type: String,
        default: null
      },

      noFlip: {
        type: Boolean,
        default: false
      },

      noRotate: {
        type: Boolean,
        default: false
      },

      mask: {
        type: String,
        default: null
      },

      imageWidth: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        croppa: {},

        isInited: false,
        ready: false,

        sliderVal: 0,
        sliderMin: 0,
        sliderMax: 0,

        onDrawDebounce: null,
        onInitialImageLoadedDebounce: null,

        chosedFile: null,
        checkedInitialImage: ''
      };
    },

    computed: {
      croppaQuality() {
        if (this.isInited && this.imageWidth) {
          return this.imageWidth / this.$refs.croppa.$el.clientWidth;
        }
        return 2;
      },

      _aspectRatio() {
        return parseFloat(this.aspectRatio);
      }
    },

    created() {
      if (this.initialImage) {
        this.checkInitialImage()
          .then((ok) => {
            if (ok) this.checkedInitialImage = this.initialImage;
            this.ready = true;
          });
      } else {
        this.ready = true;
      }
      this.onDrawDebounce = debounce(this.onDraw, 1500);
      this.onInitialImageLoadedDebounce = debounce(this.onInitialImageLoaded, 1500);
    },

    methods: {
      checkInitialImage() {
        return fetch(this.initialImage)
          .then((res) => res.ok);
      },

      onInit() {
        this.isInited = true;
      },

      onNewImage() {
        this.sliderVal = this.croppa.scaleRatio;
        this.sliderMin = this.croppa.scaleRatio;
        this.sliderMax = this.croppa.scaleRatio * 4;
      },

      onFileChoose(file) {
        this.chosedFile = file;
      },

      onImageRemove() {
        this.chosedFile = null;
        this.internalValue = null;
      },

      onInitialImageLoaded() {
        if (!this.chosedFile) {
          this.chosedFile = {
            name: this.initialImageName || imageNameFromUrl(this.initialImage)
          };
        }
      },

      onDraw() {
        this.getBlob()
          .then((blob) => {
            this.internalValue = new File([blob], this.chosedFile.name);
          });
      },

      onSliderInput(e) {
        this.croppa.scaleRatio = +e;
      },

      getMime(mimeType) {
        if (mimeType) {
          return mimeType;
        }

        if (!mimeType && this.chosedFile.name) {
          return mime.getType(this.chosedFile.name);
        }

        return 'image/png';
      },

      getDataUrl(mimeType, compressionRate = 0.9) {
        return this.croppa.generateDataUrl(
          this.getMime(mimeType),
          compressionRate
        );
      },

      getBlob(mimeType, compressionRate = 0.9) {
        return this.croppa.promisedBlob(
          this.getMime(mimeType),
          compressionRate
        );
      }
    }
  };
</script>

<style lang="scss">
  .vex-mage-input {
    &__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 1;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
