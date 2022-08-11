<template>
  <div v-if="ready">
    <div v-if="label" class="text-body-2 mb-1 text--secondary">
      {{ label }}
    </div>

    <v-sheet rounded class="overflow-hidden mb-2">
      <v-responsive :aspect-ratio="_aspectRatio">
        <div class="cropper-container" :style="cropperContainerStyle">
          <cropper
            ref="cropper"
            class="cropper grey lighten-4"
            :debounce="100"
            :src="image.src"
            :default-size="defaultSize"
            :stencil-size="fullArea"
            :stencil-component="stencilType"
            :stencil-props="{
              handlers: {},
              movable: false,
              scalable: false,
              aspectRatio: aspectRatio,
            }"
            :resize-image="!disableCrop && !noResize"
            image-restriction="stencil"
            default-boundaries="fill"
            @change="handleChange"
            @ready="handleReady"
            @error="handleError"
          />
          <div
            v-if="!image.src"
            class="cropper-background grey lighten-4 d-flex justify-center align-center"
            @click="handleImageUploadClick"
          >
            <span class="text-caption text--secondary">Click to choose image</span>
          </div>
        </div>
      </v-responsive>

      <v-divider />

      <v-sheet
        color="grey lighten-4 px-2 py-1 d-flex align-center"
        :disabled="disabled"
      >
        <template v-if="!disableCrop && !noRotate">
          <v-btn icon :disabled="isActionsDisabled" @click="handleRotateRightClick">
            <v-icon>mdi-rotate-right</v-icon>
          </v-btn>
          <v-btn icon :disabled="isActionsDisabled" @click="handleRotateLeftClick">
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>
        </template>

        <template v-if="!disableCrop && !noFlip">
          <v-btn icon :disabled="isActionsDisabled" @click="hanldleFlipHorizontalClick">
            <v-icon>mdi-flip-horizontal</v-icon>
          </v-btn>
          <v-btn icon :disabled="isActionsDisabled" @click="handleFlipVertialClick">
            <v-icon>mdi-flip-vertical</v-icon>
          </v-btn>
        </template>

        <v-spacer />

        <input
          ref="file"
          type="file"
          :accept="acceptedFileTypes"
          class="hidden"
          @change="handleImageLoad"
        >

        <v-btn
          icon
          :disabled="disabled"
          @click="handleImageUploadClick"
        >
          <v-icon>mdi-sync</v-icon>
        </v-btn>

        <v-btn icon :disabled="!image || imageLoading" @click="handleRemoveImageClick">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-sheet>
    </v-sheet>

    <v-messages v-if="errorMessages" :value="errorMessages" color="error" />
  </div>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';
  import parsePath from 'parse-path';

  // eslint-disable-next-line import/extensions,import/no-unresolved
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  // eslint-disable-next-line import/extensions,import/no-unresolved

  import {
    Cropper,
    CircleStencil,
    RectangleStencil
  } from 'vue-advanced-cropper';
  import 'vue-advanced-cropper/dist/style.css';

  // This function is used to detect the actual image type,
  function getMimeType(file, fallback = null) {
    const byteArray = new Uint8Array(file).subarray(0, 4);
    let header = '';
    for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
    }

    switch (header) {
      case '52494646':
        return 'image/webp';
      case '89504e47':
        return 'image/png';
      case '47494638':
        return 'image/gif';
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
      case 'ffd8ffe3':
      case 'ffd8ffe8':
        return 'image/jpeg';
      default:
        return fallback;
    }
  }

  /**
   * Get file name from url
   * @param {string} url
   * @return {string}
   */
  const imageNameFromUrl = (url) => {
    const { pathname } = parsePath(url);
    return pathname.split('/').pop();
  };

  /**
   * Default image
   * @return {Object} image
   * @return {null} image.src
   * @return {null} image.initialFile
   * @return {null} image.type
   */
  const defaultImage = () => ({
    src: null,
    initialFile: null,
    type: null
  });

  /**
   * Image input
   * @see See [Cropper](https://norserium.github.io/vue-advanced-cropper/)
   */
  export default defineComponent({
    name: 'VexImageInput',

    components: {
      Cropper,
      /* eslint-disable vue/no-unused-components */
      CircleStencil,
      RectangleStencil
      /* eslint-enable import/extensions,import/no-unresolved */
    },

    mixins: [Proxyable],

    props: {
      /** Initial image source */
      initialImage: {
        type: String,
        default: null
      },
      /** Initial image file name */
      initialImageName: {
        type: String,
        default: null
      },
      /** Input aspect ratio */
      aspectRatio: {
        type: [Number, String],
        default: 16 / 9
      },
      /** Input label */
      label: {
        type: String,
        default: null
      },
      /** Hide flip buttons */
      noFlip: {
        type: Boolean,
        default: false
      },
      /** Hide rotate buttons */
      noRotate: {
        type: Boolean,
        default: false
      },
      /** Disable resize */
      noResize: {
        type: Boolean,
        default: false
      },
      /** Round image */
      round: {
        type: Boolean,
        default: false
      },
      /** Return full image. Disables image edit */
      disableCrop: {
        type: Boolean,
        default: false
      },
      /** Disable control */
      disabled: {
        type: Boolean,
        default: false
      },
      /** Max file size in bytes. Default: 10Mb */
      maxSize: {
        type: Number,
        default: 1048576
      },
      /** Error messages */
      errorMessages: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        image: defaultImage(),
        imageLoading: false,
        ready: false,

        chosenFileName: null
      };
    },

    computed: {
      /** Aspect ratio */
      _aspectRatio() {
        return parseFloat(this.aspectRatio);
      },
      /** Cropper container style */
      cropperContainerStyle() {
        return this._aspectRatio
          ? { paddingBottom: `${(1 / this.aspectRatio) * 100}%` }
          : undefined;
      },
      /** Stencil type */
      stencilType() {
        return this.round ? CircleStencil : RectangleStencil;
      },
      /** Is actions buttons disabled */
      isActionsDisabled() {
        return this.disabled || !this.image.src || this.imageLoading;
      },
      /** Accepted file types */
      acceptedFileTypes() {
        return this.disableCrop ? 'image/*' : 'image/jpeg, image/png, image/webp, image/svg+xml';
      }
    },

    watch: {
      internalValue(val) {
        if (val === null) {
          this.clearImageInput();
          this.setChosenFileName(null);
          this.image = defaultImage();
        }
      }
    },

    async created() {
      if (this.initialImage) {
        const blob = await this.getInitialImage();
        if (blob) {
          this.image.src = this.initialImage;
          this.image.initialFile = new File([blob], this.initialFileName);
        }
        this.ready = true;
      } else {
        this.ready = true;
      }
    },

    destroyed() {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      if (this.image.src) {
        this.clearImageInput();
      }
    },

    methods: {
      /**
       * Fetch initial image
       * @returns {Promise}
       */
      async getInitialImage() {
        const res = await fetch(this.initialImage);
        return res.blob();
      },

      /** Set initial file name as chosen file name  */
      setInitialChosenFileName() {
        if (!this.chosenFileName) {
          this.chosenFileName = this.initialImageName || imageNameFromUrl(this.initialImage);
        }
      },

      /** Set chosen file name */
      setChosenFileName(value) {
        this.chosenFileName = value;
      },

      /** Reset cropper */
      resetCropper() {
        this.$refs.cropper.reset();
      },

      /**
       * Calculate cropper default size
       * @params {Object} payload
       * @params {Object} imageSize
       * @params {number} imageSize.width
       * @params {number} imageSize.height
       * @params {Object} visibleArea
       * @params {number} visibleArea.width
       * @params {number} visibleArea.height
       * @returns {Object} result
       * @returns {number} result.width
       * @returns {number} result.height
       */
      defaultSize({ imageSize, visibleArea }) {
        return {
          width: (visibleArea || imageSize).width,
          height: (visibleArea || imageSize).height
        };
      },

      /**
       * Calculate cropper full area
       * @params {Object} payload
       * @params {Object} imageSize
       * @params {number} boundaries.width
       * @params {number} boundaries.height
       * @returns {Object} result
       * @returns {number} result.width
       * @returns {number} result.height
       */
      fullArea({ boundaries }) {
        return {
          width: boundaries.width,
          height: boundaries.height
        };
      },

      /** Handle image upload click */
      handleImageUploadClick() {
        this.$refs.file.click();
      },

      /** Handle remove image click */
      handleRemoveImageClick() {
        this.resetCropper();
        this.setChosenFileName(null);
        this.internalValue = null;
        this.image = defaultImage();
      },

      /**
       * Handle image in cropper change
       * @param {Object} payload
       * @param {HTMLCanvasElement} payload.canvas
       */
      handleChange({ canvas }) {
        if (!this.disableCrop && canvas) {
          canvas.toBlob((blob) => {
            if (!blob) {
              return;
            }

            this.internalValue = new File([blob], this.chosenFileName);
          }, this.image.type);
        } else {
          this.internalValue = this.image.initialFile;
        }
      },

      /** Handle horizontal flip click */
      hanldleFlipHorizontalClick() {
        this.$refs.cropper.flip(true, false);
      },

      /** Handle vertical flip click */
      handleFlipVertialClick() {
        this.$refs.cropper.flip(false, true);
      },

      /** Handle right rotation click */
      handleRotateRightClick() {
        this.$refs.cropper.rotate(90);
      },

      /** Handle left rotation click */
      handleRotateLeftClick() {
        this.$refs.cropper.rotate(-90);
      },

      /** Handle initial image loading ready */
      handleReady() {
        this.imageLoading = false;
        this.setInitialChosenFileName();
      },

      /**
       * Handle error
       * @param {Error} error
       */
      handleError(error) {
        console.error(error);
        this.imageLoading = false;
      },

      /**
       * Handle image load
       * @param {Event} event
       */
      handleImageLoad(event) {
        this.imageLoading = true;
        const { files } = event.target;

        this.loadImage(files);
      },

      /**
       * Load image
       * @param {Array.<File>} files
       */
      loadImage(files) {
        if (files && files[0]) {
          const loadedFile = files[0];

          if (this.image.src) {
            URL.revokeObjectURL(this.image.src);
          }
          const blobURL = URL.createObjectURL(loadedFile);
          const reader = new FileReader();

          reader.onload = (e) => {
            this.image = {
              src: blobURL,
              initialFile: loadedFile,
              // Determine the image type to preserve it
              // during the extracting the image from canvas:
              type: getMimeType(e.target.result, loadedFile.type)
            };
          };

          reader.readAsArrayBuffer(loadedFile);

          this.setChosenFileName(loadedFile.name);
          this.resetCropper();
        }
      },

      clearImageInput() {
        URL.revokeObjectURL(this.image.src);
      }
    }
  });
</script>

<style lang="scss">
  .cropper-container {
    position: relative;
    overflow: hidden;

    .cropper, .cropper-background {
      height: 100%;
      width: 100%;
      position: absolute;
    }

    .cropper-background {
      cursor: pointer;
    }
  }

  .hidden {
    display: none;
  }
</style>
