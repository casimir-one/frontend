<template>
  <div class="d-flex">
    <v-switch
      v-for="(item, index) of switchers"
      :key="`switch-${index}`"
      v-model="internalValue[item.modelKey]"
      :label="item.label"
      hide-details="auto"
      class="mr-4"
    />
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AttributeEditProps',
    mixins: [Proxyable],
    props: {
      canBeMultiple: {
        type: Boolean,
        default: false
      },
      canBeFilterable: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      switchers() {
        return [
          ...this.genSwitch(this.canBeFilterable, 'isFilterable', 'Use in filter'),
          ...this.genSwitch(this.canBeMultiple, 'isMultiple', 'Multiple choice'),
          // ...this.genSwitch(true, 'isHidden', 'Hidden')
        ];
      }
    },

    methods: {
      genSwitch(condition, modelKey, label) {
        return condition ? [{ modelKey, label }] : [];
      }
    }
  };
</script>
