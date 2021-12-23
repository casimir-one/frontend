<template>
  <vex-block
    v-if="!loading && draft"
    :title="draft.title"
  >
    <template #title-append>
      <template v-if="withActions && canManage">
        <v-btn
          color="error"
          text
          small
          :disabled="actionLoading"
          @click="handleRemoveClick"
        >
          {{ $t('module.projectContent.draft.delete') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          small
          :disabled="actionLoading"
          @click="handleEditClick"
        >
          {{ $t('module.projectContent.draft.edit') }}
        </v-btn>

        <v-btn
          color="primary"
          small
          :disabled="actionLoading"
          @click="handlePublishClick"
        >
          {{ $t('module.projectContent.draft.publish') }}
        </v-btn>
      </template>

      <slot v-else name="title-append" />
    </template>

    <span v-if="draft.contentType" class="font-weight-medium">
      {{ $t(`module.projectContent.types.${PROJECT_CONTENT_TYPES[draft.contentType]}`) }}
    </span>

    <div>
      <span>{{ $t('module.projectContent.details.authors') }}</span>
      <users-list
        view-type="stack"
        :users="draft.authors"
      />
    </div>

    <package-content-details
      v-if="draft.formatType === PROJECT_CONTENT_FORMAT.PACKAGE"
      :content="draft"
    />

    <json-content-details
      v-if="draft.formatType === PROJECT_CONTENT_FORMAT.JSON"
      :content="draft"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock, contextMixin } from '@deip/vuetify-extended';
  import { PROJECT_CONTENT_FORMAT, PROJECT_CONTENT_TYPES } from '@deip/constants';
  import { UsersList } from '@deip/users-module';

  import PackageContentDetails from '../../common/PackageContentDetails';
  import JsonContentDetails from '../../common/JsonContentDetails';

  export default defineComponent({
    name: 'ProjectContentDetails',

    components: {
      VexBlock,
      UsersList,
      PackageContentDetails,
      JsonContentDetails
    },

    mixins: [contextMixin],

    props: {
      contentId: {
        type: String,
        required: true
      },
      withActions: {
        type: Boolean,
        default: false
      },
      canManage: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        loading: false,
        actionLoading: false,
        PROJECT_CONTENT_FORMAT,
        PROJECT_CONTENT_TYPES
      };
    },

    computed: {
      draft() {
        return this.$store.getters['projectContentDraft/one'](this.contentId);
      }
    },

    created() {
      this.getDraft();
    },

    methods: {
      emitSuccessPublish() {
        this.$emit('publish-success');
      },

      emitSuccessRemove() {
        this.$emit('remove-success');
      },

      emitEditClick() {
        this.$emit('edit-click');
      },

      async getDraft() {
        this.loading = true;
        try {
          await this.$store.dispatch('projectContentDraft/getOne', this.contentId);
        } catch (error) {
          console.error(error);
        }
        this.loading = false;
      },

      async publishDraft() {
        try {
          const payload = {
            initiator: this.$currentUser,
            data: this.draft
          };
          await this.$store.dispatch('projectContentDraft/publish', payload);
          this.emitSuccessPublish();
        } catch (error) {
          console.error(error);
        }
      },

      async removeDraft() {
        try {
          await this.$store.dispatch('projectContentDraft/remove', this.draft._id);
          this.emitSuccessRemove();
        } catch (error) {
          console.error(error);
        }
      },

      async handlePublishClick() {
        this.actionLoading = true;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmPublish.message', { title: this.draft.title }),
          { title: this.$t('module.projectContent.draft.confirmPublish.title') }
        );

        if (isConfirmed) {
          await this.publishDraft();
        }
        this.actionLoading = false;
      },

      async handleRemoveClick() {
        this.actionLoading = true;
        const isConfirmed = await this.$confirm(
          this.$t('module.projectContent.draft.confirmDelete.message', { title: this.draft.title }),
          { title: this.$t('module.projectContent.draft.confirmDelete.title') }
        );

        if (isConfirmed) {
          await this.removeDraft();
        }
        this.actionLoading = false;
      },

      handleEditClick() {
        this.emitEditClick();
      }
    }
  });
</script>
