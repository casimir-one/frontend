<template>
  <validation-observer
    v-slot="{ invalid, handleSubmit }"
    ref="observer"
    tag="div"
    style="min-width: 0px"
  >
    <v-form :disabled="loading" @submit.prevent="handleSubmit(onSubmit)">
      <ve-stack>
        <layout-renderer
          v-if="schema.length"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
        />

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <ve-stack flow="column" :gap="8">
            <v-btn
              text
              color="primary"
              :disabled="loading || disabled"
              @click="handleCancelClick"
            >
              {{ cancelLabel }}
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              :disabled="disabled || untouched || invalid"
              :loading="loading"
            >
              {{ submitLabelText }}
            </v-btn>
          </ve-stack>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { attributedFormFactory, LayoutRenderer } from '@deip/layouts-module';
  import { VeStack } from '@deip/vue-elements';
  import { defineComponent } from '@deip/platform-util';

  import { VIEW_MODE } from '@deip/constants';

  export default defineComponent({
    name: 'ProjectForm',

    components: {
      VeStack,
      LayoutRenderer
    },

    mixins: [attributedFormFactory('project', 'project')],

    props: {
      teamId: {
        type: String,
        default: null
      },
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.projects.form.cancel');
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
          ? this.$t('module.projects.form.create')
          : this.$t('module.projects.form.update');
      }
    },

    methods: {
      async onSubmit() {
        this.loading = true;

        if (this.mode === VIEW_MODE.CREATE) {
          await this.createProject();
        } else if (this.mode === VIEW_MODE.EDIT) {
          await this.updateProject();
        }

        this.loading = false;
      },

      async createProject() {
        const payload = {
          initiator: this.$currentUser,
          creator: this.$currentUser._id,
          teamId: this.teamId,
          ...this.lazyFormData
        };

        try {
          const project = await this.$store.dispatch('projects/create', payload);
          this.emitSuccess(project._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      async updateProject() {
        const payload = {
          initiator: this.$currentUser,
          ...this.lazyFormData
        };

        try {
          const project = await this.$store.dispatch('projects/update', payload);
          this.emitSuccess(project._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      emitSuccess(id) {
        this.$emit('success', id);
      },

      emitError(err) {
        console.error(err);
        this.$emit('error', err);
      },

      handleCancelClick() {
        this.$emit('cancel');
      }
    }
  });
</script>
