<template>
  <vex-autocomplete
    v-model="internalValue"
    :label="label"
    :placeholder="placeholder"
    :items="list"
    hide-details="auto"
    autocomplete="off"
  />
</template>

<script>
  import { defineComponent } from '@casimir.one/platform-util';
  import {
    isToday, getHours, getMinutes, parseISO
  } from 'date-fns';

  /* eslint-disable */
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { createRange } from 'vuetify/lib/util/helpers';
  /* eslint-enable */

  import { VexAutocomplete } from '../../VexAutocomplete';

  /**
   * Format time
   * @param {string} h
   * @param {string} m
   * @returns {string}
   */
  const formatTime = (h, m) => {
    const addLeadingZero = (s) => (s).toString().padStart(2, '0');
    return `${addLeadingZero(h)}:${addLeadingZero(m)}`;
  };

  /**
   * Time input
   */
  export default defineComponent({
    name: 'VexTimeInput',
    components: { VexAutocomplete },
    mixins: [Proxyable],
    props: {
      /** Minute step */
      minuteStep: {
        type: Number,
        default: 5
      },
      /** Placeholder */
      placeholder: {
        type: String,
        default: undefined
      },
      /** Label */
      label: {
        type: String,
        default: undefined
      },
      /** Date */
      date: {
        type: String,
        default: ''
      }
    },
    computed: {
      list() {
        const hours = createRange(24);
        const minutes = createRange(60);
        const currentDate = Date.now();

        if (isToday(parseISO(this.date))) {
          hours.splice(0, getHours(currentDate));
        }

        const list = [];

        hours.forEach((h) => {
          minutes.forEach((m) => {
            if (m % this.minuteStep === 0) {
              if (this.date) {
                if ((h === getHours(currentDate) && m > getMinutes(currentDate))
                  || h !== getHours(currentDate)) {
                  list.push(formatTime(h, m));
                }
              } else {
                list.push(formatTime(h, m));
              }
            }
          });
        });

        return list;
      }
    }
  });
</script>
