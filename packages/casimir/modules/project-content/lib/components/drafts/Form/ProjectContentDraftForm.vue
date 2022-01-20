<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
    <v-form
      :disabled="loading"
      @submit.prevent="handleSubmit(submit)"
    >
      <ve-stack :gap="24">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.projectContent.form.title')"
          rules="required"
        >
          <v-text-field
            v-model="formData.title"
            outlined
            :label="$t('module.projectContent.form.title')"
            :error-messages="errors"
            hide-details="auto"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.projectContent.form.type')"
          rules="required"
        >
          <v-select
            v-model="formData.contentType"
            :items="projectContentTypes"
            :label="$t('module.projectContent.form.type')"
            :error-messages="errors"
            item-value="value"
            outlined
            hide-details="auto"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          :name="$t('module.projectContent.form.authors')"
          rules="required"
        >
          <users-selector
            v-model="formData.authors"
            :users="project.members"
            :label="$t('module.projectContent.form.authors')"
            :error-messages="errors"
            multiple
            hide-details="auto"
          />
        </validation-provider>

        <references-selector
          v-model="formData.references"
          :label="$t('module.projectContent.form.references')"
          multiple
          hide-details="auto"
        />

        <v-radio-group
          v-if="!isEditMode"
          v-model="formData.formatType"
          :label="$t('module.projectContent.form.formatType')"
          mandatory
          class="mt-0"
          hide-details="auto"
        >
          <v-radio
            :label="$t('module.projectContent.form.text')"
            :value="PROJECT_CONTENT_FORMAT.JSON"
          />

          <v-radio
            :label="$t('module.projectContent.form.package')"
            :value="PROJECT_CONTENT_FORMAT.PACKAGE"
          />
        </v-radio-group>

        <vue-editorjs
          v-if="formData.formatType === PROJECT_CONTENT_FORMAT.JSON"
          v-model="formData.jsonData"
          :placeholder="$t('module.projectContent.form.contentPlaceholder')"
        />

        <validation-provider
          v-if="formData.formatType === PROJECT_CONTENT_FORMAT.PACKAGE"
          v-slot="{ errors }"
          :name="$t('module.projectContent.form.file')"
          rules="required"
        >
          <vex-file-input
            v-model="formData.files"
            :label="$t('module.projectContent.form.file')"
            :error-messages="errors"
            multiple
            hide-details="auto"
            :loading="filesInputLoading"
          />
        </validation-provider>

        <v-divider />

        <div class="d-flex align-center">
          <v-spacer />
          <ve-stack flow="column" :gap="8">
            <v-btn
              color="primary"
              text
              :disabled="loading || disabled"
              @click="handleCancelClick"
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
          </ve-stack>
        </div>
      </ve-stack>
    </v-form>
  </validation-observer>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { formFactory } from '@deip/platform-components';
  import { VeStack } from '@deip/vue-elements';
  import { VexFileInput } from '@deip/vuetify-extended';
  import { VueEditorjs } from '@deip/vue-editorjs';
  import { UsersSelector } from '@deip/users-module';
  import { PROJECT_CONTENT_FORMAT } from '@deip/constants';

  import { AccessService } from '@deip/access-service';

  import ReferencesSelector from '../../common/ReferencesSelector';
  import { projectContentTypes } from '../../../constants/contentTypes';

  const accessService = AccessService.getInstance();

  export default defineComponent({
    name: 'ProjectContentDraftForm',

    components: {
      VeStack,
      VexFileInput,
      ReferencesSelector,
      UsersSelector,
      VueEditorjs
    },

    mixins: [formFactory('draft')],

    props: {
      project: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      const projectContentTypesExtended = projectContentTypes
        .map((type) => ({ ...type, text: this.$t(`module.projectContent.types.${type.key}`) }));

      return {
        filesInputLoading: false,
        projectContentTypes: projectContentTypesExtended,
        PROJECT_CONTENT_FORMAT
      };
    },

    computed: {
      submitLabel() {
        return this.isEditMode
          ? this.$t('module.documentTemplates.form.update')
          : this.$t('module.documentTemplates.form.create');
      }
    },

    async created() {
      this.setExistingFiles();
    },

    methods: {
      getContentUrl(fileHash) {
        const { DEIP_SERVER_URL } = this.$env;

        return `${DEIP_SERVER_URL}/api/v2/project-content/package/${this.draft._id}/${fileHash}?download=true&authorization=${accessService.getAccessToken()}`;
      },

      async setExistingFiles() {
        if (this.formData.packageFiles?.length > 0) {
          this.filesInputLoading = true;

          try {
            this.formData.files = await Promise.all(this.formData.packageFiles.map(async (file) => {
              const res = await fetch(this.getContentUrl(file.hash));
              return new File([res.blob()], file.filename);
            }));
          } catch (error) {
            console.error('Failed to upload files', error);
          }

          this.filesInputLoading = false;
        }
      },

      async createDraft(payload) {
        try {
          await this.$store.dispatch('projectContentDraft/create', payload);
          this.emitSuccess();
        } catch (error) {
          console.error(error);
        }
      },

      async updateDraft(payload) {
        try {
          await this.$store.dispatch('projectContentDraft/update', { ...this.draft, ...payload });
          this.emitSuccess();
        } catch (error) {
          console.error(error);
        }
      },

      async submit() {
        this.loading = true;
        const payload = {
          projectId: this.project._id,
          title: this.formData.title,
          contentType: parseInt(this.formData.contentType),
          authors: this.formData.authors,
          references: this.formData.references,
          formatType: this.formData.formatType

        };

        if (this.formData.formatType === PROJECT_CONTENT_FORMAT.JSON) {
          payload.jsonData = this.formData.jsonData;
        } else if (this.formData.formatType === PROJECT_CONTENT_FORMAT.PACKAGE) {
          payload.files = this.formData.files;
        }

        if (this.isEditMode) {
          await this.updateDraft(payload);
        } else {
          await this.createDraft(payload);
        }
        this.loading = false;
      },

      emitSuccess() {
        this.$emit('success');
      },

      emitCancel() {
        this.$emit('cancel');
      },

      handleCancelClick() {
        this.emitCancel();
      }
    }
  });
</script>
