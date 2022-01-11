<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(updateUser)">
      <ve-stack :gap="32">
        <layout-renderer
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
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { AttributeSet } from '@deip/attributes-module';
  import { attributeMethodsFactory } from '@deip/platform-fns';
  import { attributedFormFactory, LayoutRenderer } from '@deip/layouts-module';
  import { VeStack } from '@deip/vue-elements';
  import { ATTR_SCOPES } from '@deip/constants';

  export default {
    name: 'UserForm',

    components: {
      LayoutRenderer,
      VeStack
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
              scopeName: ATTR_SCOPES.USER,
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
