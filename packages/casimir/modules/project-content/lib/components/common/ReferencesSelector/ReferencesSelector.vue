<template>
  <vex-autocomplete
    v-model="internalValue"
    :items="references"
    item-text="title"
    item-value="_id"
    v-bind="fieldProps"

    :loading="loading"
  >
    <template #item="{ item } ">
      <div class="py-2 text-body-2">
        {{ item.title }}
      </div>
    </template>
  </vex-autocomplete>
</template>

<script>
  /* eslint-disable import/extensions, import/no-unresolved */
  import { VAutocomplete } from 'vuetify/lib/components';
  /* eslint-enable import/extensions, import/no-unresolved */

  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { defineComponent } from '@deip/platform-util';
  import { VexAutocomplete } from '@deip/vuetify-extended';

  export default defineComponent({
    name: 'ReferencesSelector',

    components: { VexAutocomplete },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      ...VAutocomplete.options.props
    },

    data() {
      return {
      };
    },

    computed: {
      references() {
        return this.$store.getters['projectContent/list']();
      },

      internalValue: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('change', value);
        }
      },
      fieldProps() {
        return {
          ...getBindableProps.call(this, VAutocomplete.options.props),
          ...{
            autocomplete: 'off',

            offsetY: true,
            offsetOverflow: true
          }
        };
      }
    },

    created() {
      this.getReferences();
    },

    methods: {
      async getReferences() {
        try {
          await this.$store.dispatch('projectContent/getList');
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
</script>
