<template>
  <d-autocomplete
    v-model="internalValue"
    :labe="label"
    :placeholder="placeholder"
    :items="list"
    outlined
    hide-details="auto"
  />
</template>

<script>
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import { createRange } from 'vuetify/lib/util/helpers';
  import { padStart } from '@/utils/helpers';

  export default {
    name: 'DTimeInput',
    components: { DAutocomplete },
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
        const currentDate = this.moment(new Date());
        if (currentDate.format('YYYY-MM-DD') === this.date) {
          hours.splice(0, currentDate.format('HH'));
        }

        const list = [];

        for (const h of hours) {
          for (const m of minutes) {
            if (m % this.graduate === 0) {
              if (this.date) {
                if (h === parseInt(currentDate.format('HH'), 10) && m > currentDate.format('mm')) {
                  list.push(`${padStart(h, 2)}:${padStart(m, 2)}`);
                } else if (h !== parseInt(currentDate.format('HH'), 10)) {
                  list.push(`${padStart(h, 2)}:${padStart(m, 2)}`);
                }
              } else {
                list.push(`${padStart(h, 2)}:${padStart(m, 2)}`);
              }
            }
          }
        }

        return list;
      }
    }
  };
</script>
