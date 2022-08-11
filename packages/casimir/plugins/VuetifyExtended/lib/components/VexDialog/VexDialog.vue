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
        <v-toolbar-title v-if="Boolean(title) || hasSlot('title')" class="text-h5">
          <template v-if="hasSlot('title')">
            <slot name="title" />
          </template>
          <template v-else>
            {{ title }}
          </template>
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          small
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
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
  /* eslint-disable import/extensions, import/no-unresolved */
  import { defineComponent } from '@casimir/platform-util';
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
  /* eslint-enable import/extensions, import/no-unresolved */
  import { contextMixin } from '../../composables';

  /**
   * Dialogs inform users about a task and can contain critical information,
   * require decisions, or involve multiple tasks.
   */
  export default defineComponent({
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
    mixins: [Toggleable, contextMixin],
    props: {
      /** Title */
      title: {
        type: String,
        default: null
      },
      /** Message */
      message: {
        type: String,
        default: null
      },
      /** Confirm button label */
      buttonTrueText: {
        type: String,
        default: 'Confirm'
      },
      /** Cancel button label */
      buttonFalseText: {
        type: [String, Boolean],
        default: 'Cancel'
      },
      /** Confirm button props */
      buttonTrueProps: {
        type: Object,
        default: () => ({ text: true, color: 'primary' })
      },
      /** Cancel buttons props */
      buttonFalseProps: {
        type: Object,
        default: () => ({ text: true, color: 'primary' })
      },
      /** Maximum width of the component */
      maxWidth: {
        type: [String, Number],
        default: 420
      },
      /** Clicking outside of the element or pressing esc key will not deactivate it. */
      persistent: Boolean,
      /** Hides buttons panel */
      hideButtons: Boolean,
      /** Disables the ability to open the component. */
      disabled: Boolean,
      /** Disables Cancel button */
      cancelDisabled: Boolean,
      /** Disables Confirm button */
      trueDisabled: Boolean,
      /** Makes dialog  */
      confirm: Boolean
    },

    data() {
      return {
        confirmValue: false
      };
    },

    computed: {

    },

    methods: {
      /** Emit events on user choice */
      emitEvent(eventName, e) {
        if (!this.$listeners[eventName]) {
          this.choose(e);
        }
        /**
         * @event click:cancel
         * @event click:confirm
         * @param {boolean} e user decision
         */
        this.$emit(eventName, e);
      },

      /** Handle Cancel button click */
      cancelButtonClick() {
        this.emitEvent('click:cancel', false);
      },

      /** Handle Confirm button click */
      confirmButtonClick() {
        this.emitEvent('click:confirm', true);
      },

      /** Handle user choice */
      choose(resultValue) {
        this.confirmValue = resultValue;
        /**
         * @param {boolean} resultValue user decision
         */
        this.$emit('result', resultValue);
        this.closeDialog();
      },

      /**
       * Handle dialog close
       * @param {boolean} e the updated bound model
       */
      closeDialog(e) {
        if (this.confirm) {
          this.$destroy();
        } else {
          this.isActive = false;
        }
        /** @param {boolean} e the updated bound model */
        this.$emit('close', e);
      }
    }
  });
</script>
