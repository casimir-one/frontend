<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
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
            {{ submitLabel }}
          </v-btn>
        </div>
      </vex-stack>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  import { VexStack } from '@deip/vuetify-extended';
  import { SchemaRenderer } from '@deip/schema-renderer';
  import { AttributeSet } from '@deip/attributes-module';
  import { attributedFormFactory } from '@deip/platform-fns';
  import { TEAM_FORM_MODES } from '../constants';

  export default {
    name: 'TeamForm',

    components: {
      VexStack,
      SchemaRenderer
    },

    mixins: [attributedFormFactory('team')],

    props: {
      mode: {
        type: [String, Number],
        default: TEAM_FORM_MODES.CREATE,
        validation(value) {
          return TEAM_FORM_MODES.keys().indexOf(value) !== -1;
        }
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
          return this.mode === TEAM_FORM_MODES.CREATE
            ? this.$t('module.teams.form.create')
            : this.$t('module.teams.form.update');
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
          getAttributeFileSrc: this.getAttributeFileSrc
        };
      }
    },

    methods: {
      getAttributeFileSrc(attributeId, filename) {
        const hasValue = !!filename && filename !== 'null' && filename !== 'undefined';

        if (hasValue) {
          return this.$attributes.getFileSrc({
            scope: 'team',
            scopeId: this.formData.externalId,
            attributeId,
            filename
          });
        }
        return '';
      },

      onSubmit() {
        if (this.mode === TEAM_FORM_MODES.CREATE) {
          this.createTeam();
        } else if (this.mode === TEAM_FORM_MODES.EDIT) {
          this.updateTeam();
        }
      },

      createTeam() {
        this.loading = true;

        return this.$store.dispatch(
          'teams/create',
          {
            creator: this.$currentUser,
            ...this.lazyFormData
          }
        )
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
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
