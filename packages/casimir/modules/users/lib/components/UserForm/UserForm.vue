<template>
  <validation-observer v-slot="{ handleSubmit, invalid }">
    <ve-raw-display
      v-if="$env.NODE_ENV === 'development'"
      :value="formData"
      class="mb-6"
    />

    <v-form @submit.prevent="handleSubmit(onSubmit)">
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
            :disabled="loading"
            text
            class="mr-2"
            @click="handleCancelClick"
          >
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="untouched || invalid"
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
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
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
      },
      // override mixin prop
      mode: {
        type: [String, Number],
        default: VIEW_MODE.EDIT,
        validator(value) {
          return value === VIEW_MODE.EDIT;
        }
      }
    },

    computed: {
      submitLabelText() {
        if (this.submitLabel) {
          return this.submitLabel;
        }

        return this.$t('module.users.form.update');
      }
    },

    methods: {
      async  onSubmit() {
        this.loading = true;

        await this.updateUser();

        this.loading = false;
      },

      async updateUser() {
        const payload = {
          initiator: this.$currentUser,
          ...this.lazyFormData
        };

        try {
          await this.$store.dispatch('users/update', payload);
          this.emitSuccess();
        } catch (err) {
          this.emitError(err);
        }
      },

      emitSuccess() {
        this.$emit('success');
      },

      emitError(err) {
        console.error(err);
        this.$emit('error', err);
      },

      handleCancelClick() {
        this.restoreOldValue(true);
      }
    }
  });
</script>