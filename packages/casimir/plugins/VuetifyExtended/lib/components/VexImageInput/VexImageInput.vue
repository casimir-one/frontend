<template lang="html">
  <div v-if="ready">
    <div v-if="label" class="text-body-2 mb-1 text--secondary">
      {{ label }}
    </div>

    <v-sheet rounded class="overflow-hidden ">
      <v-responsive :aspect-ratio="_aspectRatio">
        <div class="cropper-container" :style="cropperContainerStyle">
          <cropper
            ref="cropper"
            class="cropper grey lighten-4"
            :debounce="100"
            :src="image"
            :default-size="defaultSize"
            :stencil-size="fullArea"
            :stencil-component="stencilType"
            :stencil-props="{
              handlers: {},
              movable: false,
              scalable: false,
              aspectRatio: aspectRatio,
            }"
            image-restriction="stencil"
            default-boundaries="fill"
            @change="handleChange"
            @ready="handleReady"
            @error="handleError"
          />
          <div
            v-if="!image"
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
        <template v-if="!noRotate">
          <v-btn icon :disabled="isActionsDisabled" @click="handleRotateRightClick">
            <v-icon>mdi-rotate-right</v-icon>
          </v-btn>
          <v-btn icon :disabled="isActionsDisabled" @click="handleRotateLeftClick">
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>
        </template>

        <template v-if="!noFlip">
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
          accept="image/*"
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
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
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

  const imageNameFromUrl = (url) => {
    const { pathname } = parsePath(url);
    return pathname.split('/').pop();
  };

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

      round: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        image: null,
        imageLoading: false,
        ready: false,

        chosenFileName: null
      };
    },

    computed: {
      _aspectRatio() {
        return parseFloat(this.aspectRatio);
      },

      cropperContainerStyle() {
        return this._aspectRatio
          ? { paddingBottom: `${(1 / this.aspectRatio) * 100}%` }
          : undefined;
      },

      stencilType() {
        return this.round
          ? this.$options.components.CircleStencil
          : this.$options.components.RectangleStencil;
      },

      isActionsDisabled() {
        return this.disabled || !this.image || this.imageLoading;
      }
    },

    async created() {
      if (this.initialImage) {
        const ok = await this.checkInitialImage();
        if (ok) this.image = this.initialImage;
        this.ready = true;
      } else {
        this.ready = true;
      }
    },

    destroyed() {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      if (this.image) {
        URL.revokeObjectURL(this.image);
      }
    },

    methods: {
      checkInitialImage() {
        return fetch(this.initialImage)
          .then((res) => res.ok);
      },

      setInitialChosenFileName() {
        if (!this.chosenFileName) {
          this.chosenFileName = this.initialImageName || imageNameFromUrl(this.initialImage);
        }
      },

      setChosenFileName(value) {
        this.chosenFileName = value;
      },

      resetCropper() {
        this.$refs.cropper.reset();
      },

      defaultSize({ imageSize, visibleArea }) {
        return {
          width: (visibleArea || imageSize).width,
          height: (visibleArea || imageSize).height
        };
      },

      fullArea({ boundaries }) {
        return {
          width: boundaries.width,
          height: boundaries.height
        };
      },

      handleImageUploadClick() {
        this.$refs.file.click();
      },

      handleRemoveImageClick() {
        this.resetCropper();
        this.setChosenFileName(null);
        this.internalValue = null;
        this.image = null;
      },

      handleChange({ canvas }) {
        if (canvas) {
          canvas.toBlob((blob) => {
            if (!blob) {
              return;
            }

            this.internalValue = new File([blob], this.chosenFileName);
          });
        }
      },

      hanldleFlipHorizontalClick() {
        this.$refs.cropper.flip(true, false);
      },

      handleFlipVertialClick() {
        this.$refs.cropper.flip(false, true);
      },

      handleRotateRightClick() {
        this.$refs.cropper.rotate(90);
      },

      handleRotateLeftClick() {
        this.$refs.cropper.rotate(-90);
      },

      handleReady() {
        this.imageLoading = false;
        this.setInitialChosenFileName();
      },

      handleError(error) {
        console.error(error);
        this.imageLoading = false;
      },

      handleImageLoad(event) {
        this.imageLoading = true;
        const { files } = event.target;
        this.loadImage(files);
      },

      loadImage(files) {
        if (files && files[0]) {
          if (this.image) {
            URL.revokeObjectURL(this.image);
          }
          const blob = URL.createObjectURL(files[0]);
          this.image = blob;
          this.setChosenFileName(files[0].name);
          this.resetCropper();
        }
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
