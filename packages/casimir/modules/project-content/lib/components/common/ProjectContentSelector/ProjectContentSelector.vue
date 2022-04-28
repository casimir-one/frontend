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
      projectId: {
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
          if (this.projectId) {
            await this.$store.dispatch('projectContent/getListByProjectId', this.projectId);
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
