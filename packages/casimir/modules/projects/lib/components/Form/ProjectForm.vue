<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form v-if="$$ready" :disabled="isLoading" @submit.prevent="handleSubmit(onSubmit)">
      <!-- TODO: form renderer will be here -->

      <v-divider class="mt-8 mb-6" />

      <div class="d-flex justify-end align-center">
        <ve-stack flow="column" :gap="8">
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
            {{ formModel._id
              ? $t('module.projects.form.update')
              : $t('module.projects.form.create') }}
          </v-btn>
        </ve-stack>
      </div>
    </v-form>
  </validation-observer>
</template>

<script>
  import { cloneDeep } from '@deip/toolbox/lodash';
  import { VeStack } from '@deip/vue-elements';

  import { hasValue } from '@deip/toolbox';

  import { VIEW_MODE } from '@deip/constants';

  export default {
    name: 'ProjectForm',

    components: {
      VeStack
    },

    // mixins: [changeable, dataReadyMixin],

    props: {
      mode: {
        type: [String, Number],
        default: VIEW_MODE.CREATE,
        validation(value) {
          return VIEW_MODE.keys().indexOf(value) !== -1;
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
          attributes: {}
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
        if (this.mode === VIEW_MODE.CREATE) {
          this.createProject();
        } else if (this.mode === VIEW_MODE.EDIT) {
          this.updateProject();
        }
      },

      createProject() {
        const payload = {
          creator: this.$currentUser,
          data: {
            creator: this.$currentUser._id
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
            updater: this.$currentUser._id
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
