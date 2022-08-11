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
          :key="forceUpdateKey"
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
  import { attributedFormFactory, LayoutRenderer } from '@casimir/layouts-module';
  import { VeStack } from '@casimir/vue-elements';
  import { defineComponent } from '@casimir/platform-util';

  import { ViewMode } from '@casimir/platform-core';

  export default defineComponent({
    name: 'NftCollectionForm',

    components: {
      VeStack,
      LayoutRenderer
    },

    mixins: [attributedFormFactory('nftCollection', 'nftCollection')],

    props: {
      /**
       * Id of the team
       */
      teamId: {
        type: String,
        default: null
      },
      /**
       * Cancel label
       *
       * @example 'Cancel'
       */
      cancelLabel: {
        type: String,
        default() {
          return this.$t('module.nftCollections.form.cancel');
        }
      },
      /**
       * Submit label
       *
       * @example 'Submit'
       */
      submitLabel: {
        type: String,
        default() {
          return null;
        }
      }
    },

    computed: {
      /**
       * Get computed text for submit label
       */
      submitLabelText() {
        if (this.submitLabel) {
          return this.submitLabel;
        }

        return this.mode === ViewMode.CREATE
          ? this.$t('module.nftCollections.form.create')
          : this.$t('module.nftCollections.form.update');
      }
    },

    methods: {
      /**
       * Triggers when user submits form
       *
       * @event submit
       */
      async onSubmit() {
        this.loading = true;

        if (this.mode === ViewMode.CREATE) {
          await this.createNftCollection();
        } else if (this.mode === ViewMode.EDIT) {
          await this.updateNftCollection();
        }

        this.loading = false;
      },

      /**
       * Create NFT collection
       */
      async createNftCollection() {
        const payload = {
          initiator: this.$currentUser,
          data: {
            issuer: this.teamId ? this.teamId : this.$currentUser._id,
            issuedByTeam: !!this.teamId,
            ...this.lazyFormData
          }
        };

        try {
          const nftCollection = await this.$store.dispatch('nftCollections/create', payload);
          this.emitSuccess(nftCollection._id);
          this.clearForm();
        } catch (err) {
          this.emitError(err);
        }
      },

      /**
       * Update NFT collection
       */
      async updateNftCollection() {
        const payload = {
          initiator: this.$currentUser,
          data: this.lazyFormData
        };

        try {
          const nftCollection = await this.$store.dispatch('nftCollections/update', payload);
          this.emitSuccess(nftCollection._id);
        } catch (err) {
          this.emitError(err);
        }
      },

      emitSuccess(id) {
        /**
         * Success event
         *
         * @property {string} id
         */
        this.$emit('success', id);
      },

      emitError(err) {
        console.error(err);
        /**
       * Triggers when error occurs
       *
       * @property {Error} err
       */
        this.$emit('error', err);
      },

      handleCancelClick() {
        /**
       * Triggers by clicking on cancel button
       */
        this.$emit('cancel');
      },

      clearForm() {
        this.restoreOldValue(true);
        this.$refs.observer.reset();
      }
    }
  });
</script>
