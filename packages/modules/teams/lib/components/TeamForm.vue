<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(createTeam)"
    >
      <vex-stack :gutter="formGutter">
        <slot name="prepend"/>

        <vex-stack :gutter="fieldsGutter">
          <validation-provider
            v-slot="{ errors }"
            :name="nameLabel"
            rules="required"
          >
            <v-text-field
              v-model="formModel.name"
              :label="nameLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
            />
          </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            :name="descriptionLabel"
            rules="required"
          >
            <v-textarea
              v-model="formModel.description"
              :label="descriptionLabel"
              :error-messages="errors"
              v-bind="fieldsProps"
            />
          </validation-provider>
        </vex-stack>

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

        <slot name="append"/>

      </vex-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { TEAM_FORM_MODES } from '../variables';

  export default {
    name: 'TeamForm',
    props: {
      mode: {
        type: [ String, Number ],
        default: TEAM_FORM_MODES.CREATE,
        validation(value) {
          return TEAM_FORM_MODES.keys().indexOf(value) !== -1
        }
      },

      nameLabel: {
        type: String,
        default: 'Name'
      },

      descriptionLabel: {
        type: String,
        default: 'Description'
      },

      fieldsProps: {
        type: Object,
        default: () => ({
          outlined: true
        })
      },

      formGutter: {
        type: [ String, Number ],
        default: 48
      },

      fieldsGutter: {
        type: [ String, Number ],
        default: 8
      },

      cancelLabel: {
        type: String,
        default: 'Cancel'
      },

      submitLabel: {
        type: String,
        default: 'Create'
      },
    },
    data() {
      return {
        TEAM_FORM_MODES,
        loading: false,
        formModel: {
          name: '',
          description: '',
          members: []
        }
      }
    },
    methods: {
      onSubmit() {
        this.createTeam();
      },

      createTeam() {
        this.loading = true;
        console.log(this.$currentUser)

        return this.$store.dispatch(
          'teams/create',
          {
            ...this.formModel,
            ...{
              creator: this.$currentUser
            }
          }
        )
        .then((res) => {
          this.loading = false;
        })
      }
    }
  }
</script>
