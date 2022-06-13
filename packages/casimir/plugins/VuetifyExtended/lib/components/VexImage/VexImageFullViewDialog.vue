<template>
  <v-dialog
    v-model="isFullViewDialogOpen"
    width="auto"
    persistent
  >
    <v-card class="image-card">
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

      <v-img
        width="100%"
        height="100%"
        :src="src"
        contain
      />
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

    computed: {
      isFullViewDialogOpen: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    },

    methods: {
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
    z-index: 1;
    top: 32px;
    right: 32px;
  }
  .image-card {
    position: relative;
    overflow: hidden;
  }
</style>
