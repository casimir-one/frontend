<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form v-if="$$ready" :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
      <!-- TODO: form renderer will be here -->

      <v-divider class="mt-8 mb-6" />

      <div class="d-flex justify-end align-center">
        <vex-stack horizontal :gap="8">
          <v-btn
            text
            color="primary"
            :disabled="isLoading"
            @click="$router.back()"
          >
            {{ $t('module.projects.form.cancel') }}
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            :disabled="isDisabled || invalid"
            :loading="isLoading"
          >
            {{ formModel.externalId
              ? $t('module.projects.form.update')
              : $t('module.projects.form.create') }}
          </v-btn>
        </vex-stack>
      </div>
    </v-form>
  </validation-observer>
</template>

<script>
  import { cloneDeep } from 'lodash/fp';
  import { VexStack } from '@deip/vuetify-extended';

  import { changeable, dataReadyMixin } from '@deip/platform-fns';

  import { hasValue } from '@deip/toolbox';

  import { PROJECT_FORM_MODES } from '../../constants';

  export default {
    name: 'ProjectForm',

    components: {
      VexStack
    },

    mixins: [changeable, dataReadyMixin],

    props: {
      mode: {
        type: [String, Number],
        default: PROJECT_FORM_MODES.CREATE,
        validation(value) {
          return PROJECT_FORM_MODES.keys().indexOf(value) !== -1;
        }
      },
      project: {
        type: Object,
        default: () => ({})
      },
      submitLabel: {
        type: String,
        default() { return this.$t('module.projects.form.create'); }
      }
    },

    data() {
      return {
        isLoading: false,
        lazyFormModel: {
          researchRef: { attributes: {} }
        }
      };
    },

    computed: {
      formModel: {
        get() {
          return this.lazyFormModel;
        },

        set(val) {
          this.lazyFormModel = val;
        }
      },

      isDisabled() {
        return this.isLoading
          || !this.$$isChanged(this.formModel);
      }
    },

    created() {
      if (hasValue(this.project)) {
        this.formModel = {
          ...this.formModel,
          ...cloneDeep(this.project)
        };
      }

      this.$$storeCache(this.formModel);
      this.$$setReady();
    },

    methods: {
      onSubmit() {
        this.isLoading = true;
        if (this.mode === PROJECT_FORM_MODES.CREATE) {
          this.createProject();
        } else if (this.mode === PROJECT_FORM_MODES.EDIT) {
          this.updateProject();
        }
      },

      createProject() {
        const payload = {
          creator: this.$currentUser,
          data: {
            creator: this.$currentUser.username,
            // TODO
            // teamId,
            // domains,
            // isPrivate,
            // members,
            // inviteLifetime,
            // reviewShare,
            // compensationShare,
            // attributes,
            // formData
            memoKey: this.$currentUser.account.memo_key
          },
          proposal: {
            // isProposal
          }
        };

        return this.$store.dispatch('projects/create', payload)
          .then((project) => {
            this.$emit('success', project);
          })
          .catch((err) => {
            console.error(err);
            this.$emit('error', err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },

      updateProject() {
        const payload = {
          creator: this.$currentUser,
          data: {
            updater: this.$currentUser.username
            // TODO
            // projectId,
            // teamId,
            // domains,
            // isPrivate,
            // members,
            // inviteLifetime,
            // reviewShare,
            // compensationShare,
            // attributes,
            // formData
          },
          proposal: {
            // isProposal
          }
        };

        return this.$store.dispatch('projects/update', payload)
          .then((project) => {
            this.$emit('success', project);
          })
          .catch((err) => {
            console.error(err);
            this.$emit('error', err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  };
</script>
