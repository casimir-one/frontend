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
            :disabled="loading || disabled"
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
  import { AttributeSet } from '@deip/attributes-module';
  import { attributedFormFactory } from '@deip/platform-fns';
  import { VexStack } from '@deip/vuetify-extended';

  export default {
    name: 'UserForm',

    components: {
      SchemaRenderer,
      VexStack
    },

    mixins: [attributedFormFactory('user')],

    data() {
      return {
        rendererComponents: {
          AttributeSet
        }
      };
    },

    computed: {
      schemaData() {
        return {
          getAttributeFileSrc: this.getAttributeFileSrc
        };
      }
    },

    methods: {
      getAttributeFileSrc(attributeId, filename) {
        const hasValue = !!filename && filename !== 'null' && filename !== 'undefined';

        if (hasValue) {
          return this.$attributes.getFileSrc({
            scope: 'user',
            scopeId: this.formData._id,
            attributeId,
            filename
          });
        }
        return '';
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
