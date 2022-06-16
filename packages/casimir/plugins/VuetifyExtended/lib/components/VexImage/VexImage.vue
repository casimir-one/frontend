<template>
  <div>
    <v-img
      :src="src"
      v-bind="imgProps"
    >
      <div v-if="fullView" class="d-flex justify-end mt-8 mr-8">
        <v-btn
          icon
          small
          kind="secondary"
          class="white"
          title="Open"
          @click="handleFullViewClick"
        >
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
      </div>
    </v-img>
    <vex-image-full-view-dialog
      v-if="fullView"
      v-model="isFullViewDialogOpen"
      :src="src"
    />
  </div>
</template>

<script>
  // eslint-disable-next-line import/extensions,import/no-unresolved
  import { VImg } from 'vuetify/lib/components';
  import { getBindableProps } from '../../composables';
  import VexImageFullViewDialog from './VexImageFullViewDialog';

  /**
   * Component shows image and allows to open in a full view dialog
   * @see See [v-img](https://vuetifyjs.com/en/api/v-img/)
   */
  export default {
    name: 'VexImage',

    components: {
      VexImageFullViewDialog
    },

    props: {
      ...VImg.options.props,
      /** Allow open image in full view dialog */
      fullView: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        isFullViewDialogOpen: false
      };
    },

    computed: {
      /** Image props bound from VImg */
      imgProps() {
        return {
          ...getBindableProps.call(this, VImg.options.props)
        };
      },

      /** Minimum image width */
      minImageWidth() {
        return this.$vuetify.breakpoint.xs ? null : '500';
      }
    },

    methods: {
      /** Handle Full view button click */
      handleFullViewClick() {
        this.isFullViewDialogOpen = true;
      }
    }
  };
</script>
