<template>
  <v-sheet class="d-flex">
    <v-spacer
      style="margin-right: -1px;"
    >
      <vex-date-input
        v-model="internalValue.date"
        :label="label"
        :only-future="onlyFuture"
        :field-props="{class: 'rounded-br-0 rounded-tr-0', ...attrs$}"
      />
    </v-spacer>
    <v-sheet min-width="112px" width="30%">
      <vex-time-input
        v-model="internalValue.time"
        :date="onlyFuture ? internalValue.date : ''"
        placeholder="00:00"
        class="rounded-bl-0 rounded-tl-0"
      />
    </v-sheet>
  </v-sheet>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  /* eslint-disable */
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  /* eslint-enable */

  import { VexDateInput } from '../VexDateInput';
  import { VexTimeInput } from '../VexTimeInput';

  /**
   * Date and time input
   */
  export default defineComponent({
    name: 'VexDateTimeInput',
    components: { VexDateInput, VexTimeInput },
    mixins: [BindsAttrs],
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      /** Label */
      label: {
        type: String,
        default: null
      },
      /** Only future time */
      onlyFuture: {
        type: Boolean,
        default: false
      },
      /**
       * Value
       * @model
       */
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        internalValue: {
          date: '',
          time: '00:00'
        }
      };
    },
    watch: {
      internalValue: {
        handler(val) {
          if (this.stringifyVal(val) === this.value) return;
          /**
           * Change event
           * @param {string} value
           */
          this.$emit('change', this.stringifyVal(val));
        },
        deep: true
      },

      value: {
        handler(val) {
          if (val === this.stringifyVal(this.internalValue)) return;
          this.internalValue = this.parseVal(val);
        },
        immediate: true
      }
    },
    methods: {
      /**
       * Parse string dateTime
       * @param {string} dateTime
       * @returns {Object} result
       * @returns {string} result.date
       * @returns {string} result.time
       */
      parseVal(dateTime) {
        const [date, time] = dateTime.split('T');
        const [hours = '00', min = '00'] = time.split(':');

        return { date, time: `${hours}:${min}` };
      },
      /**
       * Stringify datetime value
       * @param {Object} dateTime
       * @param {string} dateTime.date
       * @param {string} dateTime.time
       * @returns {string}
       */
      stringifyVal(dateTime) {
        const { date, time } = dateTime;
        const [hours = '00', min = '00', sec = '00'] = time.split(':');

        if (!date) return '';

        return `${date}T${hours}:${min}:${sec}`;
      }
    }
  });
</script>
