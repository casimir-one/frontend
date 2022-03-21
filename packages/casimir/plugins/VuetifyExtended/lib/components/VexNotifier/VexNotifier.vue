<template>
  <v-snackbar
    :value="isActive"
    v-bind="snackbarProps"

    @input="closeSnackbar"
  >
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="closeSnackbar"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import Toggleable from 'vuetify/lib/mixins/toggleable';
  import {
    VBtn,
    VSnackbar,
  } from 'vuetify/lib/components';
  /* eslint-enable */

  /**
   * Component for displaying popup messages
   */
  export default defineComponent({
    name: 'VexNotifier',

    components: {
      VBtn,
      VSnackbar
    },

    mixins: [Toggleable],

    props: {
      /**
       * Text message
       * For other possible properties @see see [ v-snackbar API ](https://vuetifyjs.com/en/api/v-snackbar/)
       */
      message: {
        type: String,
        default: null
      },
      ...VSnackbar.options.props
    },

    computed: {
      snackbarProps() {
        return Object.keys(VSnackbar.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      }
    },

    methods: {
      /**
       * Close notifier
       * Fires when the user clicks the close button on the notification
       */
      closeSnackbar() {
        this.isActive = false;

        setTimeout(() => {
          this.$destroy();
        }, 150);
      }
    }
  });
</script>
