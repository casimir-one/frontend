<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <ve-raw-display
      v-if="$env.NODE_ENV === 'development'"
      :value="formData"
      class="mb-6"
    />

    <v-form @submit.prevent="handleSubmit(updateUser)">
      <ve-stack :gap="32">
        <layout-renderer
          v-if="schema.length"
          :key="forceUpdateKey"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
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
            {{ submitLabelText }}
          </v-btn>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { attributedFormFactory, LayoutRenderer } from '@deip/layouts-module';
  import { VeStack, VeRawDisplay } from '@deip/vue-elements';
  import { VIEW_MODE } from '@deip/constants';

  export default {
    name: 'UserForm',

    components: {
      LayoutRenderer,
      VeStack,
      VeRawDisplay
    },

    mixins: [attributedFormFactory('user', 'user')],

    props: {
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.users.form.cancel');
        }
      },
      submitLabel: {
        type: String,
        default() {
          return null;
        }
      }
    },

    computed: {
      submitLabelText() {
        if (this.submitLabel) {
          return this.submitLabel;
        }

        return this.mode === VIEW_MODE.CREATE
          ? this.$t('module.users.form.create')
          : this.$t('module.users.form.update');
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
