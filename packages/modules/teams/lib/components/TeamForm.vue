<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <!-- TODO: form renderer will be here -->

      <v-divider />

      <div class="d-flex">
        <v-spacer />
        <v-btn
          color="primary"
          text
          :disabled="loading"
          @click="$router.back()"
        >
          {{ cancelLabel }}
        </v-btn>
        <v-btn
          type="submit"
          color="primary"
          depressed
          :disabled="invalid || loading"
          :loading="loading"
        >
          {{ submitLabel }}
        </v-btn>
      </div>

      <slot name="append" />
    </v-form>
  </validation-observer>
</template>

<script>
  import { TEAM_FORM_MODES } from '../constants';

  export default {
    name: 'TeamForm',

    props: {
      mode: {
        type: [String, Number],
        default: TEAM_FORM_MODES.CREATE,
        validation(value) {
          return TEAM_FORM_MODES.keys().indexOf(value) !== -1;
        }
      },
      team: {
        type: Object,
        default: () => ({})
      },
      cancelLabel: {
        type: String,
        default() { return this.$t('module.teams.form.cancel'); }
      },
      submitLabel: {
        type: String,
        default() { return this.$t('module.teams.form.create'); }
      }
    },

    data() {
      return {
        loading: false
      };
    },

    methods: {
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
            // TODO
            //  attributes,
            //  formData,
            ...{
              creator: this.$currentUser
            }
          }
        )
          .finally(() => {
            this.loading = false;
          });
      },

      updateTeam() {
        this.loading = true;

        return this.$store.dispatch(
          'teams/create',
          {
            // TODO
            //  attributes,
            //  formData,
            // proposalInfo,
            teamId: this.team.external_id,
            ...{
              updater: this.$currentUser
            }
          }
        )
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
