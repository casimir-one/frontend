<template>
  <v-rating v-model="internalValue" :readonly="readonly" class="host">
    <template #item="props">
      <v-btn
        :disabled="readonly"
        class="pa-0 reset-width"
        depressed
        v-bind="sizeProps"
        @click="props.click"
      >
        <v-sheet
          class="box"
          :color="props.isFilled ? getColor(props.value) : 'grey lighten-2'"
          v-bind="sizeProps"
        />
      </v-btn>
    </template>
  </v-rating>
</template>

<script>
  import chunk from 'chunk';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'Rating',
    mixins: [Proxyable],
    props: {
      colorSchema: {
        type: String,
        default: 'semantic',
        validate(val) {
          return ['semantic', 'gradient'].includes(val);
        }
      },
      segments: {
        type: Number,
        default: 5
      },
      size: {
        type: [Number, String],
        default: 14
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      palette() {
        return ['error', 'warning', 'success'];
      },
      sizeProps() {
        return {
          width: this.size,
          height: this.size
        };
      }
    },
    methods: {
      getColor(value) {
        const array = Array.from(Array(this.segments)
          .keys())
          .map((v, i, a) => a.length - v);
        const keyMap = chunk(array, this.palette.length - 1)
          .reverse();
        const index = keyMap.indexOf(keyMap.find((v) => v.includes(value)));
        return this.palette[index];
      }
    }
  };
</script>

<style lang="scss" scoped>
  .host {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    grid-gap: 4px;
  }
  .box {
    border-radius: 1px;
    transition: background-color .1s;
  }
</style>
