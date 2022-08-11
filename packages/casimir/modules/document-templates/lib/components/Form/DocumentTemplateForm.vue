<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <ve-stack gap="24">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.documentTemplates.form.title')"
          rules="required"
        >
          <v-text-field
            v-model="formData.title"
            :label="$t('module.documentTemplates.form.title')"
            autocomplete="off"
            hide-details="auto"
            :error-messages="errors"
          />
        </validation-provider>

        <vex-message expandable>
          <span>{{ $t('module.documentTemplates.form.placeholdersMessage') }}</span>
          <ul>
            <li v-for="placeholder in placeholders" :key="placeholder">
              {{ formatPlaceholder(placeholder) }}
            </li>
          </ul>
        </vex-message>

        <vue-editorjs
          v-model="formData.body"
          :placeholder="$t('module.documentTemplates.form.bodyPlaceholder')"
          :tools="editorTools"
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
            {{ $t('module.documentTemplates.form.cancel') }}
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
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { defineComponent } from '@casimir/platform-util';

  import { VexMessage } from '@casimir/vuetify-extended';
  import { VeStack } from '@casimir/vue-elements';
  import { VueEditorjs, PlaceholderTool } from '@casimir/vue-editorjs';
  import { formFactory } from '@casimir/platform-components';

  export default defineComponent({
    name: 'DocumentTemplateForm',

    components: { VeStack, VexMessage, VueEditorjs },

    mixins: [formFactory('template')],

    props: {
      /**
       * User or team account
       */
      account: {
        type: String,
        required: true
      },
      /**
       * Placeholders list
       */
      placeholders: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        editorTools: {
          placeholder: {
            class: PlaceholderTool,
            config: {
              placeholders: this.placeholders.map((p) => this.formatPlaceholder(p)),
              buttonContent: '{{}}'
            }
          }
        }
      };
    },

    computed: {
      /**
       * Get computed text for submit label
       */
      submitLabel() {
        return this.isEditMode
          ? this.$t('module.documentTemplates.form.update')
          : this.$t('module.documentTemplates.form.create');
      }
    },

    methods: {
      /**
       * Format placeholder
       *
       * @param {string} placeholder
       */
      formatPlaceholder(placeholder) {
        return `{{${placeholder}}}`;
      },
      /**
       * Triggers when user submits form
       *
       * @event submit
       */
      onSubmit() {
        if (this.isEditMode) {
          this.updateTemplate();
        } else {
          this.createTemplate();
        }
      },
      /**
       * Create document template
       */
      createTemplate() {
        this.loading = true;

        return this.$store.dispatch('documentTemplates/create', {
          account: this.account,
          ...this.lazyFormData
        })
          .then((res) => {
            /**
              * Success event
              *
              * @property {Object} res
            */
            this.$emit('success', res);
          })
          .catch((err) => {
            /**
             * Triggers when error occurs
             *
             * @property {Error} err
            */
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      /**
       * Update document template
       */
      updateTemplate() {
        this.loading = true;
        this.$store.dispatch('documentTemplates/update', this.lazyFormData)
          .then((res) => {
            /**
              * Success event
              *
              * @property {Object} res
            */
            this.$emit('success', res);
          })
          .catch((err) => {
            /**
             * Triggers when error occurs
             *
             * @property {Error} err
            */
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  });
</script>
