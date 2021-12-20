<template>
  <vex-block v-if="!loading && content" :title="content.title">
    <span v-if="content.contentType">
      {{ $t(`module.projectContent.types.${RESEARCH_CONTENT_TYPES[content.contentType]}`) }}
    </span>

    <div>
      <span>{{ $t('module.projectContent.details.authors') }}</span>
      <users-list
        view-type="stack"
        :users="content.authors"
      />
    </div>

    <package-content-details
      v-if="content.formatType === PROJECT_CONTENT_FORMAT.PACKAGE"
      :content="content"
    />

    <json-content-details
      v-if="content.formatType === PROJECT_CONTENT_FORMAT.JSON"
      :content="content"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock } from '@deip/vuetify-extended';
  import { PROJECT_CONTENT_FORMAT, RESEARCH_CONTENT_TYPES } from '@deip/constants';
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

    props: {
      contentId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        loading: false,
        PROJECT_CONTENT_FORMAT,
        RESEARCH_CONTENT_TYPES
      };
    },

    computed: {
      content() {
        return this.$store.getters['projectContent/one'](this.contentId);
      }
    },

    created() {
      this.getContent();
    },

    methods: {
      async getContent() {
        this.loading = true;
        try {
          await this.$store.dispatch('projectContent/getOne', this.contentId);
        } catch (error) {
          console.error(error);
        }
        this.loading = false;
      }
    }
  });
</script>
