<template>
  <v-row no-gutters :style="rowStyles">
    <v-col v-for="(items, index) of criteriasChunks" :key="index" :style="colStyles">
      <vex-dot-list :items="items" row-align="center">
        <template #label="{ item }">
          <div class="text-body-2">
            {{ item.title }}
          </div>
        </template>
        <template #value="{ item }">
          <rating
            v-model="form[item.id]"
            :readonly="readonly"
            :segments="item.max"
          />
        </template>
      </vex-dot-list>
    </v-col>
  </v-row>
</template>

<script>
  import chunk from 'chunk';
  import { VexDotList } from '@deip/vuetify-extended';
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import Rating from '../Rating/Rating';
  import { reviewsMixin } from '../../mixins/mixins';

  export default {
    name: 'ReviewAssessment',
    components: { Rating, VexDotList },
    mixins: [reviewsMixin],

    props: {
      value: {
        type: Object,
        required: true
      },
      contentType: {
        type: Number,
        required: true
      },
      readonly: {
        type: Boolean,
        required: false,
        default: true
      },

      columns: {
        type: Number,
        default: 1
      },

      gap: {
        type: [Number, String],
        default: 24
      },

      gutter: {
        type: [Number, String],
        default: 24
      }
    },

    data() {
      return {
        form: Object.keys(this.value)
          .reduce((form, field) => {
            // eslint-disable-next-line no-param-reassign
            form[field] = this.value[field];
            return form;
          }, {})
      };
    },

    computed: {
      criterias() {
        return this.$$getAssessmentCriterias(this.contentType);
      },

      criteriasChunks() {
        return chunk(this.criterias, Math.ceil(this.criterias.length / this.columns));
      },

      gutterValue() {
        return `${this.gutterInfo.number / 2}${this.gutterInfo.unit}`;
      },

      rowStyles() {
        return {
          marginLeft: `-${this.gutterValue}`,
          marginRight: `-${this.gutterValue}`
        };
      },

      colStyles() {
        return {
          paddingLeft: this.gutterValue,
          paddingRight: this.gutterValue
        };
      },

      gutterInfo() {
        const matches = convertToUnit(this.gutter).match(/^(\d+)(\w+)/);

        return {
          string: matches[0],
          number: parseFloat(matches[1]),
          unit: matches[2]
        };
      }

    },

    watch: {

      value: {
        handler(newVal) {
          const keys = Object.keys(newVal);
          for (let i = 0; i < keys.length; i++) {
            const id = keys[i];
            if (this.criterias.some(
              (criteria) => criteria.id === id
            ) && this.form[id] !== newVal[id]) {
              this.form[id] = newVal[id];
            }
          }
        },
        deep: true
      },

      form: {
        handler(newVal) {
          this.$emit('input', newVal);
        },
        deep: true
      }
    }
  };
</script>
