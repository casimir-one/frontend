<template>
  <v-menu
    v-model.trim="open"
    :close-on-content-click="false"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        ref="field"
        v-model="dateText"
        :label="label"
        outlined
        hide-details="auto"
        append-icon="mdi-calendar"
        v-bind="internalFieldProps"

        @click:clear="$refs.field.blur()"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="internalValue"
      v-bind="pickerProps"
      :allowed-dates="allowedDates"
      @change="onChange"
    />
  </v-menu>
</template>

<script>
  import moment from 'moment';

  import Validatable from 'vuetify/lib/mixins/validatable';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { isArray } from '@deip/toolbox';

  export default {
    name: 'VexDateInput',
    mixins: [Proxyable],
    props: {
      label: {
        type: String,
        default: null
      },
      pickerProps: {
        type: Object,
        default: () => ({})
      },
      fieldProps: {
        type: Object,
        default: () => ({})
      },
      onlyFuture: {
        type: Boolean,
        default: false
      },

      ...Validatable.options.props
    },
    data() {
      return {
        open: false
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
      onChange(e) {
        this.$emit('change', e);
        this.open = false;
      },
      allowedDates(val) {
        if (this.onlyFuture) {
          return moment(val).isSameOrAfter(moment.utc().local(), 'day');
        }

        return true;
      }
    }
  };
</script>
