<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <ve-raw-display :value="formData.attributes" />
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <vex-stack gutter="32">
        <vls-parser
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
            text
            :disabled="loading || disabled"
            @click="$router.back()"
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
      </vex-stack>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  import { VexStack } from '@deip/vuetify-extended';
  import { VlsParser } from '@deip/vue-layout-schema';
  import { AttributeSet } from '@deip/attributes-module'; // check
  import { attributeMethodsFactory } from '@deip/platform-fns';
  import { attributedFormFactory } from '@deip/layouts-module';
  import { VIEW_MODE, ATTR_SCOPES } from '@deip/constants';
  import { VeRawDisplay } from '@deip/vue-elements';

  export default {
    name: 'TeamForm',

    components: {
      VexStack,
      VlsParser,
      VeRawDisplay
    },

    mixins: [attributedFormFactory('team')],

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

    data() {
      return {
        rendererComponents: {
          ...this.components,
          ...{
            AttributeSet
          }
        }
      };
    },

    computed: {
      schemaData() {
        return {
          ...attributeMethodsFactory(
            this.formData,
            {
              scopeName: ATTR_SCOPES.TEAM,
              scopeId: this.formData.externalId
            }
          )
        };
      },

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
      onSubmit() {
        if (this.mode === VIEW_MODE.CREATE) {
          this.createTeam();
        } else if (this.mode === VIEW_MODE.EDIT) {
          this.updateTeam();
        }
      },

      createTeam() {
        this.loading = true;

        return this.$store.dispatch(
          'teams/create',
          {
            isCreateDefaultProject: this.withDefaultProject,
            initiator: this.$currentUser,
            ...this.lazyFormData
          }
        )
          .then((res) => {
            this.$emit('success', res.entityId);
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      updateTeam() {
        this.loading = true;

        return this.$store.dispatch(
          'teams/update',
          {
            initiator: this.$currentUser,
            ...this.lazyFormData
          }
        )
          .then((res) => {
            this.$emit('success', res.entityId);
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
