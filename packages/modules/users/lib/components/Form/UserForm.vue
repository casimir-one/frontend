<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateUser)">
      <vex-stack gutter="32">
        <schema-renderer
          v-if="schema.length"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
          :components="rendererComponents"
        />

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="disabled"
            text
            class="mr-2"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="disabled || untouched || invalid"
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { SchemaRenderer } from '@deip/schema-renderer';
  import { AttributeSet, expandAttributes, compactAttributes } from '@deip/attributes-module';
  import { isEqual, cloneDeep } from 'lodash/fp';
  import { getAttributeFileSrc } from '@deip/platform-fns';
  import { VexStack } from '@deip/vuetify-extended';

  export default {
    name: 'UserForm',

    components: {
      SchemaRenderer,
      VexStack
    },

    model: {
      prop: 'value',
      event: 'input'
    },

    props: {
      schema: {
        type: Array,
        default: () => []
      },
      value: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        rendererComponents: {
          AttributeSet
        },

        lazyFormData: null,

        disabled: false,
        loading: false,

        oldValue: null
      };
    },

    computed: {
      formData: {
        get() {
          return {
            ...this.lazyFormData,
            ...{
              attributes: expandAttributes(this.lazyFormData.attributes)
            }
          };
        },
        set(val) {
          if (isEqual(val, this.lazyFormData)) return;
          this.lazyFormData = {
            ...val,
            ...{
              attributes: compactAttributes(val.attributes)
            }
          };
          this.$emit('input', val);
        }
      },

      schemaData() {
        return {
          getAttributeFileSrc: this.getAttributeFileSrc
        };
      },

      untouched() {
        return this.oldValue && isEqual(this.oldValue, this.value);
      }
    },

    watch: {
      value: {
        handler(val) {
          if (val && !isEqual(this.value, this.lazyFormData)) this.lazyFormData = val;
        },
        immediate: true,
        deep: true
      }
    },

    created() {
      if (this.value) {
        this.oldValue = cloneDeep(this.value);
      }
    },

    methods: {
      getAttributeFileSrc(attributeId, filename) {
        return getAttributeFileSrc(
          'user',
          this.formData._id,
          attributeId,
          filename
        );
      },

      updateUser() {
        this.disabled = true;
        this.loading = true;

        this.$store.dispatch('users/update', this.lazyFormData)
          .then(() => {
            this.$emit('success');
          })
          .catch((error) => {
            this.$emit('error', error);
          })
          .finally(() => {
            this.disabled = false;
            this.loading = false;
          });
      }
    }
  };
</script>
