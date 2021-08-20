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
  import { defineComponent } from '@deip/platform-util';

  import { VexMessage } from '@deip/vuetify-extended';
  import { VeStack } from '@deip/vue-elements';
  import VueEditorjs from '@deip/vue-editorjs';
  import { formFactory } from '@deip/platform-components';

  export default defineComponent({
    name: 'DocumentTemplateForm',

    components: { VeStack, VexMessage, VueEditorjs },

    mixins: [formFactory('template')],

    props: {
      account: {
        type: String,
        required: true
      },
      placeholders: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      submitLabel() {
        return this.isEditMode
          ? this.$t('module.documentTemplates.form.update')
          : this.$t('module.documentTemplates.form.create');
      }
    },

    methods: {
      formatPlaceholder(placeholder) {
        return `{{${placeholder}}}`;
      },

      onSubmit() {
        if (this.isEditMode) {
          this.updateTemplate();
        } else {
          this.createTemplate();
        }
      },

      createTemplate() {
        this.loading = true;

        return this.$store.dispatch('documentTemplates/create', {
          account: this.account,
          ...this.lazyFormData
        })
          .then((res) => {
            this.$emit('success', res);
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      updateTemplate() {
        this.loading = true;
        this.$store.dispatch('documentTemplates/update', this.lazyFormData)
          .then((res) => {
            this.$emit('success', res);
          })
          .catch((err) => {
            this.$emit('error', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  });
</script>
