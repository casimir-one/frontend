<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateUser)">
      <vex-stack gutter="32">
        <schema-renderer
          v-if="schema.length"
          :key="forceUpdateKey"
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
            @click="handleClick"
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
  import { attributeMethodsFactory } from '@deip/platform-fns';
  import { attributedFormFactory } from '@deip/layouts-module';
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
          ...attributeMethodsFactory(
            this.formData,
            {
              scopeName: 'user',
              scopeId: this.formData._id
            }
          )
        };
      }
    },

    methods: {
      updateUser() {
        this.disabled = true;
        this.loading = true;

        const payload = {
          initiator: this.$currentUser,
          ...this.lazyFormData
        };

        this.$store.dispatch('users/update', payload)
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
      },

      handleClick() {
        this.restoreOldValue(true);
      }
    }
  };
</script>
