<template>
  <vex-block
    :title="$t('module.fundraising.createForm.selectDates')"
    compact
  >
    <v-row>
      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.fundraising.createForm.startDate')"
          vid="startDate"
          rules="required|dateBefore:@endDate|dateAfterNow"
        >
          <vex-date-time-input
            v-model="startDate"
            :error-messages="errors"
            :label="$t('module.fundraising.createForm.startDate')"
            only-future
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.fundraising.createForm.endDate')"
          vid="endDate"
          rules="required|dateAfter:@startDate"
        >
          <vex-date-time-input
            v-model="endDate"
            :error-messages="errors"
            :label="$t('module.fundraising.createForm.endDate')"
            only-future
          />
        </validation-provider>
      </v-col>
    </v-row>
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock, VexDateTimeInput } from '@deip/vuetify-extended';

  export default defineComponent({
    name: 'FundraisingDatesInput',

    components: { VexBlock, VexDateTimeInput },

    model: {
      prop: 'dates',
      event: 'change'
    },

    props: {
      dates: {
        type: Object,
        default: () => ({
          start: null,
          end: null
        })
      }
    },

    computed: {
      startDate: {
        get() {
          return this.dates.start;
        },
        set(value) {
          this.$emit('change', { start: value, end: this.endDate });
        }
      },
      endDate: {
        get() {
          return this.dates.end;
        },
        set(value) {
          this.$emit('change', { start: this.startDate, end: value });
        }
      }
    }
  });
</script>
