<template>
  <project-content-data-provider
    v-bind="providerProps"
  >
    <template #default="{contentList, loading}">
      <v-data-table
        v-if="contentList"
        :headers="tableHeaders"
        :items="contentList"
        :loading="loading"
        disable-sort
        disable-pagination
        hide-default-footer
        @click:row="handleRowClick"
      >
        <template #item.type="{item}">
          {{ getContentType(item.metadata.formatType) }}
        </template>

        <template #item.title="{item}">
          {{ item.metadata.title }}
        </template>
      </v-data-table>
    </template>
  </project-content-data-provider>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';

  import { NFT_ITEM_METADATA_TYPES } from '@deip/constants';

  import ProjectContentDataProvider from '../DataProvider';

  /**
   * Component for project content list
   */
  export default defineComponent({
    name: 'ProjectContentList',

    components: {
      ProjectContentDataProvider
    },

    props: {
      ...ProjectContentDataProvider.options.props,

      /**
       * If content click is disabled
       */
      disableContentClick: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        tableHeaders: [
          {
            text: this.$t('module.projectContent.contentList.type'),
            value: 'type'
          },
          {
            text: this.$t('module.projectContent.contentList.title'),
            value: 'title',
            width: '60%'
          }
        ]
      };
    },

    computed: {
      /**
       * Get computed provider properties
       */
      providerProps() {
        return getBindableProps.call(this, ProjectContentDataProvider.options.props);
      }
    },

    methods: {
      /**
       * Get content type
       *
       * @param {string} type
       */
      getContentType(type) {
        return this.$t(`module.projectContent.types.${NFT_ITEM_METADATA_TYPES[type]}`);
      },
      /**
       * Row click handler
       * @param {Object} content
       */
      handleRowClick(content) {
        if (this.$isUser && !this.disableContentClick) {
          /**
           * Triggers when user clicks the row
           * @property {Object} content
           * @event click-row
           */
          this.$emit('click-row', content);
        }
      }
    }
  });
</script>
