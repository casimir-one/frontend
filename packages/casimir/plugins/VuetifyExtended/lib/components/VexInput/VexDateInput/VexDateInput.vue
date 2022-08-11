<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="false"
    :close-on-click="!isFocus"
    offset-y
    min-width="290px"
  >
    <template #activator="{ }">
      <v-text-field
        ref="field"
        v-model="dateText"
        :label="label"
        hide-details="auto"
        append-icon="mdi-calendar"
        autocomplete="off"
        v-bind="internalFieldProps"
        @focus="handleTextFieldFocus"
        @blur="handleTextFieldBlur"
      />
    </template>
    <v-date-picker
      v-model="internalValue"
      v-bind="pickerProps"
      :allowed-dates="allowedDates"
      @change="handleDatePickerChange"
    />
  </v-menu>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';
  import { isFuture, isToday, parseISO } from 'date-fns';

  /* eslint-disable */
  import Validatable from 'vuetify/lib/mixins/validatable';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  /* eslint-enable */

  import { isArray } from '@casimir/toolbox';
  /**
   * Date input with datepicker
   */
  export default defineComponent({
    name: 'VexDateInput',
    mixins: [Proxyable],
    props: {
      /** Label */
      label: {
        type: String,
        default: null
      },
      /**
       * Date picker props
       * @see See [props](https://vuetifyjs.com/en/api/v-date-picker/#props)
       */
      pickerProps: {
        type: Object,
        default: () => ({})
      },
      /**
       * Text field props
       * @see See [props](https://vuetifyjs.com/en/api/v-text-field/#props)
       */
      fieldProps: {
        type: Object,
        default: () => ({})
      },
      /** Enable only future dates */
      onlyFuture: {
        type: Boolean,
        default: false
      },

      ...Validatable.options.props
    },
    data() {
      return {
        isOpen: false,
        isFocus: false
      };
    },
    computed: {

      validatableProps() {
        return Object.keys(Validatable.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      },

      internalFieldProps() {
        return {
          ...this.fieldProps,
          ...this.validatableProps
        };
      },

      internalPickerProps() {
        return {
          ...this.pickerProps
        };
      },

      dateText: {
        get() {
          if (isArray(this.internalValue)) {
            if (this.pickerProps.range) {
              return this.internalValue.join(' ~ ');
            }
            return this.internalValue.join(', ');
          }
          return this.internalValue;
        },
        set(val) {
          if (isArray(this.internalValue)) {
            if (!val) {
              this.internalValue = [];
            } else {
              this.internalValue = val;
            }
          } else {
            this.internalValue = '';
          }
        }
      }
    },
    methods: {
      /**
       * Handle date picker change
       * @param {string} e
       */
      handleDatePickerChange(e) {
        /**
         * Change event
         * @param {string} value
         */
        this.$emit('change', e);
        this.toggleCalendar();
      },
      /**
       * Check if date is allowed
       * @param {string} val
       * @returns {boolean} check result
       */
      allowedDates(val) {
        if (this.onlyFuture) {
          const date = parseISO(val);
          return isToday(date) || isFuture(date);
        }

        return true;
      },
      /** Toggle calendar */
      toggleCalendar() {
        this.isOpen = !this.isOpen;
      },
      /** Toggle focus */
      toggleFocus() {
        this.isFocus = !this.isFocus;
      },
      /** Handle text field focus */
      handleTextFieldFocus() {
        this.toggleFocus();
        this.isOpen = true;
      },
      /** Handle text field blur */
      handleTextFieldBlur() {
        this.toggleFocus();
      }
    }
  });
</script>
