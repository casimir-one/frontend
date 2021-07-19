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
  import { defineComponent } from '@deip/platform-fns';
  /* eslint-disable */
  import Toggleable from 'vuetify/lib/mixins/toggleable';
  import {
    VBtn,
    VSnackbar,
  } from 'vuetify/lib/components';
  /* eslint-enable */

  export default defineComponent({
    name: 'VexNotifier',

    components: {
      VBtn,
      VSnackbar
    },

    mixins: [Toggleable],

    props: {
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
      closeSnackbar() {
        this.isActive = false;

        setTimeout(() => {
          this.$destroy();
        }, 150);
      }
    }
  });
</script>
