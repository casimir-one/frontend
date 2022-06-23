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

  /**
   * @deprecated
   * Component for references selector
   */
  export default defineComponent({
    name: 'ProjectContentSelector',

    components: { VexAutocomplete },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      ...VAutocomplete.options.props,
      nftCollectionId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
      };
    },

    computed: {
      /**
       * Get computed references list
       */
      references() {
        return this.$store.getters['projectContent/list']();
      },

      internalValue: {
        get() {
          return this.value;
        },
        set(value) {
          /**
            * Triggers when value changes
            *
            * @property {Object} value
            */
          this.$emit('change', value);
        }
      },
      /**
       * Get computed field properties
       */
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
      /**
       * Get references list
       */
      async getReferences() {
        try {
          if (this.nftCollectionId) {
            await this.$store.dispatch('projectContent/getListByNftCollectionId',
                                       this.nftCollectionId);
          } else {
            await this.$store.dispatch('projectContent/getList');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
</script>
