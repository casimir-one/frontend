<template>
  <v-dialog
    v-model="isFullViewDialogOpen"
    width="auto"
    persistent
  >
    <v-card :height="imageHeight" class="image-card">
      <div class="d-flex justify-end close-button">
        <v-btn
          icon
          small
          outlined
          text
          class="white"
          title="Close"
          @click.prevent="handleCloseClick"
        >
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>
      </div>

      <img
        :width="imageWidth"
        :height="imageHeight"
        :src="src"
        @load="handleImageLoaded"
      >
    </v-card>
  </v-dialog>
</template>

<script>
  /** Show image in a dialog */
  export default {
    name: 'VexImageFullViewDialog',

    props: {
      /**
       * Value
       * @model
       */
      value: {
        type: Boolean,
        default: false
      },
      /** Image src */
      src: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        naturalWidth: 0,
        naturalHeight: 0
      };
    },

    computed: {
      isFullViewDialogOpen: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      },
      /** Image width */
      imageWidth() {
        return this.naturalWidth > 1100 ? '1100' : this.naturalWidth;
      },
      /** Image height */
      imageHeight() {
        return this.naturalHeight > 600 ? '600' : this.naturalHeight;
      }
    },

    methods: {
      /**
       * Handle image load
       * @param {Object}
       */
      handleImageLoaded(e) {
        const img = e.target;
        if (img) {
          this.naturalWidth = img.naturalWidth;
          this.naturalHeight = img.naturalHeight;
        }
      },

      /** Close dialog */
      closeDialog() {
        this.isFullViewDialogOpen = false;
      },

      /** Handle Close button click */
      handleCloseClick() {
        this.closeDialog();
      }
    }
  };
</script>

<style scoped lang="scss">
  .close-button {
    position: absolute;
    top: 32px;
    right: 32px;
  }
  .image-card {
    position: relative;
    overflow: hidden;
  }
</style>
