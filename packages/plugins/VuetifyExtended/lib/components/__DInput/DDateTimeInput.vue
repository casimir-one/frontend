<template>
  <v-sheet class="d-flex">
    <v-spacer
      style="margin-right: -1px;"
    >
      <d-input-date
        v-model="internalValue.date"
        :label="label"
        :only-future="onlyFuture"
        :field-props="{class: 'rounded-br-0 rounded-tr-0', ...attrs$}"
      />
    </v-spacer>
    <v-sheet min-width="112px" width="30%">
      <d-time-input
        v-model="internalValue.time"
        :date="onlyFuture ? internalValue.date : ''"
        placeholder="00:00"
        class="rounded-bl-0 rounded-tl-0"
      />
    </v-sheet>
  </v-sheet>
</template>

<script>
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DTimeInput from '@/components/Deipify/DInput/DTimeInput';

  export default {
    name: 'DDateTimeInput',
    components: { DTimeInput, DInputDate },
    mixins: [BindsAttrs],
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      label: {
        type: String,
        default: null
      },
      onlyFuture: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        internalValue: {
          date: '',
          time: ''
        }
      };
    },
    watch: {
      internalValue: {
        handler(val) {
          if (this.stringifyVal(val) === this.value) return;
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
      parseVal(dateTime) {
        const [date, time] = dateTime.split('T');

        return { date, time };
      },

      stringifyVal(dateTime) {
        const { date, time } = dateTime;

        if (!date) return '';

        return `${date}T${time || '00:00'}:00`;
      }
    }
  };
</script>
