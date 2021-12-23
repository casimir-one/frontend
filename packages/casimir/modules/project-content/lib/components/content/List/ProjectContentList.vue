<template>
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
      {{ getContentType(item.contentType) }}
    </template>

    <template #item.title="{item}">
      {{ item.title }}
    </template>
  </v-data-table>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { PROJECT_CONTENT_TYPES } from '@deip/constants';

  export default defineComponent({
    name: 'ProjectContentList',

    props: {
      contentList: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: true
      },
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

    methods: {
      getContentType(type) {
        return this.$t(`module.projectContent.types.${PROJECT_CONTENT_TYPES[type]}`);
      },

      handleRowClick(content) {
        if (this.$isUser && !this.disableContentClick) {
          this.$emit('click-row', content);
        }
      }
    }
  });
</script>
