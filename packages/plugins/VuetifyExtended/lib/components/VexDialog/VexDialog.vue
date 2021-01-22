<template>
  <v-dialog
    eager
    :value="isActive"
    :max-width="maxWidth"
    :persistent="persistent"
    scrollable
    @input="closeDialog"
    @keydown.esc="choose(false)"
  >
    <v-card tile>
      <v-toolbar>
        <v-toolbar-title class="text-h5" v-if="Boolean(title)">
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          small
          icon
          @click="closeDialog"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text class="text-body-2 text--primary pa-6 white-space-pre-line">
        {{ message }}
        <slot />
      </v-card-text>

      <template v-if="!hideButtons">
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="Boolean(buttonFalseText)"
            v-bind="buttonFalseProps"
            :disabled="disabled || cancelDisabled"
            @click="cancelButtonClick"
          >
            {{ buttonFalseText }}
          </v-btn>
          <v-btn
            v-if="Boolean(buttonTrueText)"
            v-bind="buttonTrueProps"
            :disabled="disabled || trueDisabled"
            @click="confirmButtonClick"
          >
            {{ buttonTrueText }}
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
  import Toggleable from 'vuetify/lib/mixins/toggleable';
  import {
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    VBtn,
    VIcon,
    VDivider
  } from 'vuetify/lib/components';

  export default {
    name: 'VexDialog',
    components: {
      VDialog,
      VCard,
      VCardText,
      VCardActions,
      VToolbar,
      VToolbarTitle,
      VSpacer,
      VBtn,
      VIcon,
      VDivider
    },
    mixins: [Toggleable],
    props: {
      title: {
        type: String,
        default: null
      },
      message: {
        type: String,
        default: null
      },
      buttonTrueText: {
        type: String,
        default: 'Confirm'
      },
      buttonFalseText: {
        type: [String, Boolean],
        default: 'Cancel'
      },

      buttonTrueProps: {
        type: Object,
        default: () => ({ text: true, color: 'primary' })
      },

      buttonFalseProps: {
        type: Object,
        default: () => ({ text: true, color: 'primary' })
      },

      maxWidth: {
        type: [String, Number],
        default: 420
      },
      persistent: Boolean,
      hideButtons: Boolean,
      disabled: Boolean,
      cancelDisabled: Boolean,
      trueDisabled: Boolean,
      loading: Boolean,
      confirm: Boolean
    },

    data() {
      return {
        confirmValue: false
      };
    },

    computed: {

    },

    // mounted() {
    //   document.addEventListener('keyup', this.onEnterPressed);
    // },
    // destroyed() {
    //   document.removeEventListener('keyup', this.onEnterPressed);
    // },

    methods: {
      // onEnterPressed(e) {
      //   if (e.keyCode === 13) {
      //     e.stopPropagation();
      //     this.choose(true);
      //   }
      // },

      call(eventName, e) {
        if (!this.$listeners[eventName]) {
          this.choose(e);
        }
        this.$emit(eventName, e);
      },

      cancelButtonClick(e) {
        this.call('click:cancel', false);
      },

      confirmButtonClick(e) {
        this.call('click:confirm', true);
      },

      choose(resultValue) {
        this.confirmValue = resultValue;
        this.$emit('result', resultValue);
        this.closeDialog();
      },

      closeDialog(e) {
        if (this.confirm) {
          this.$destroy();
        } else {
          this.isActive = false;
        }
        this.$emit('close', e);
      }
    }
  };
</script>
