<template>
  <validation-observer
    v-slot="{ invalid, handleSubmit }"
    ref="observer"
    tag="div"
    style="min-width: 0px"
  >
    <ve-raw-display
      v-if="$env.NODE_ENV === 'development'"
      :value="formData.attributes"
      class="mb-6"
    />

    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <ve-stack :gap="32">
        <layout-renderer
          v-if="schema.length"
          v-model="formData"
          :schema="schema"
          :schema-data="schemaData"
        />

        <v-divider />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="primary"
            text
            :disabled="loading || disabled"
            @click="handleCancelClick"
          >
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            depressed
            :disabled="disabled || untouched || invalid"
            :loading="loading"
          >
            {{ submitLabelText }}
          </v-btn>
        </div>
      </ve-stack>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  import { attributedFormFactory, LayoutRenderer } from '@deip/layouts-module';
  import { VIEW_MODE } from '@deip/constants';
  import { VeRawDisplay, VeStack } from '@deip/vue-elements';
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'TeamForm',

    components: {
      VeStack,
      VeRawDisplay,

      LayoutRenderer
    },

    mixins: [attributedFormFactory('team', 'team')],

    props: {
      withDefaultProject: {
        type: Boolean,
        default: false
      },
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.teams.form.cancel');
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
          ? this.$t('module.teams.form.create')
          : this.$t('module.teams.form.update');
      }
    },

    methods: {
      async onSubmit() {
        this.loading = true;

        if (this.mode === VIEW_MODE.CREATE) {
          await this.createTeam();
        } else if (this.mode === VIEW_MODE.EDIT) {
          await this.updateTeam();
        }

        this.loading = false;
      },

      async createTeam() {
        try {
          const team = await this.$store.dispatch(
            'teams/create',
            {
              isCreateDefaultProject: this.withDefaultProject,
              initiator: this.$currentUser,
              ...this.lazyFormData
            }
          );
          this.emitSuccess(team._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      async updateTeam() {
        try {
          const team = await this.$store.dispatch(
            'teams/update',
            {
              initiator: this.$currentUser,
              ...this.lazyFormData
            }
          );
          this.emitSuccess(team._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      emitSuccess(id) {
        this.$emit('success', id);
      },

      emitError(err) {
        this.$emit('error', err);
      },

      handleCancelClick() {
        this.$emit('cancel');
      }
    }
  });
</script>
