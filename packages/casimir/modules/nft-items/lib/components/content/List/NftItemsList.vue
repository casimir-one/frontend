<template>
  <nft-items-data-provider
    v-bind="providerProps"
  >
    <template #default="{nftItemsList, loading}">
      <v-data-table
        v-if="nftItemsList"
        :headers="tableHeaders"
        :items="nftItemsList"
        :loading="loading"
        disable-sort
        disable-pagination
        hide-default-footer
        @click:row="handleRowClick"
      >
        <template #item.title="{item}">
          {{ item.title }}
        </template>
      </v-data-table>
    </template>
  </nft-items-data-provider>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';

  import NftItemsDataProvider from '../DataProvider';

  /**
   * Component for NFT item list
   */
  export default defineComponent({
    name: 'NftItemsList',

    components: {
      NftItemsDataProvider
    },

    props: {
      ...NftItemsDataProvider.options.props,

      /**
       * If NFT item click is disabled
       */
      disableNFTItemClick: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        tableHeaders: [
          {
            text: this.$t('module.nftItems.contentList.title'),
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
        return getBindableProps.call(this, NftItemsDataProvider.options.props);
      }
    },

    methods: {
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
