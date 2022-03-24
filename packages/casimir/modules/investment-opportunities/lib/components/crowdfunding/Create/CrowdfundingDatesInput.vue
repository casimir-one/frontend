<template>
  <vex-block
    :title="$t('module.crowdfunding.createForm.selectDates')"
    compact
  >
    <v-row>
      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.crowdfunding.createForm.startDate')"
          vid="startDate"
          rules="required|dateBefore:@endDate|dateAfterNow"
        >
          <vex-date-time-input
            v-model="startDate"
            :error-messages="errors"
            :label="$t('module.crowdfunding.createForm.startDate')"
            only-future
          />
        </validation-provider>
      </v-col>

      <v-col cols="12" md="6">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.crowdfunding.createForm.endDate')"
          vid="endDate"
          rules="required|dateAfter:@startDate"
        >
          <vex-date-time-input
            v-model="endDate"
            :error-messages="errors"
            :label="$t('module.crowdfunding.createForm.endDate')"
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

  /**
   * Component for creating crowdfunding dates input
   */
  export default defineComponent({
    name: 'CrowdfundingDatesInput',

    components: { VexBlock, VexDateTimeInput },

    model: {
      prop: 'dates',
      event: 'change'
    },

    props: {
      /**
       * Dates info
       *
       * @model
       */
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
          /**
           * Triggers when start date changes
           *
           * @property {Object} dates
           * @property {string} dates.start
           * @property {string} dates.end
           */
          this.$emit('change', { start: value, end: this.endDate });
        }
      },
      endDate: {
        get() {
          return this.dates.end;
        },
        set(value) {
          /**
           * Triggers when end date changes
           *
           * @property {Object} dates
           * @property {string} dates.start
           * @property {string} dates.end
           */
          this.$emit('change', { start: this.startDate, end: value });
        }
      }
    }
  });
</script>
