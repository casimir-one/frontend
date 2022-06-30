<template>
  <vex-block v-if="!loading && content" :title="content.title">
    <div>
      <span>{{ $t('module.nftItems.details.authors') }}</span>
      <users-list
        view-type="stack"
        :users="content.authors"
      />
    </div>

    <nft-item-details
      v-if="content.formatType === NFT_ITEM_METADATA_FORMAT.PACKAGE"
      :content="content"
    />

    <json-content-details
      v-if="content.formatType === NFT_ITEM_METADATA_FORMAT.JSON"
      :content="content"
    />
  </vex-block>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import { VexBlock } from '@deip/vuetify-extended';
  import { NFT_ITEM_METADATA_FORMAT } from '@casimir/platform-core';
  import { UsersList } from '@deip/users-module';

  import NftItemDetails from '../../common/NftItemDetails';
  import JsonContentDetails from '../../common/JsonContentDetails';

  /**
   * Component for NFT item details
   */
  export default defineComponent({
    name: 'NftItemDetails',

    components: {
      VexBlock,
      UsersList,
      NftItemDetails,
      JsonContentDetails
    },

    props: {
      /**
       * Nft Item id
       */
      nftItemId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        loading: false,
        NFT_ITEM_METADATA_FORMAT
      };
    },

    computed: {
      /**
       * Get computed NFT item by id
       */
      nftItem() {
        return this.$store.getters['nftItems/one'](this.nftItemId);
      }
    },

    created() {
      this.getNftItem();
    },

    methods: {
      /**
       * Get NFT item by id
       */
      async getNftItem() {
        this.loading = true;
        try {
          await this.$store.dispatch('nftItems/getOne', this.nftItemId);
        } catch (error) {
          console.error(error);
        }
        this.loading = false;
      }
    }
  });
</script>
