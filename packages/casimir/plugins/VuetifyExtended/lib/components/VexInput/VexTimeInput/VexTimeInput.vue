<template>
  <vex-autocomplete
    v-model="internalValue"
    :label="label"
    :placeholder="placeholder"
    :items="list"
    outlined
    hide-details="auto"
    autocomplete="off"
  />
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import {
    isToday, getHours, getMinutes, parseISO
  } from 'date-fns';

  /* eslint-disable */
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { createRange } from 'vuetify/lib/util/helpers';
  /* eslint-enable */

  import { padStart } from '@deip/toolbox/lodash';

  import { VexAutocomplete } from '../../VexAutocomplete';

  const formatTime = (h, m) => {
    const addLeadingZero = (s) => padStart(s, 2, '0');
    return `${addLeadingZero(h)}:${addLeadingZero(m)}`;
  };

  export default defineComponent({
    name: 'VexTimeInput',
    components: { VexAutocomplete },
    mixins: [Proxyable],
    props: {
      graduate: {
        type: Number,
        default: 5
      },
      placeholder: {
        type: String,
        default: undefined
      },
      label: {
        type: String,
        default: undefined
      },
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
            if (m % this.graduate === 0) {
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
