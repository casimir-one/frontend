<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  /**
   * NFT item data provider
   */
  export default defineComponent({
    name: 'NftItemsDataProvider',
    props: {
      /**
       * Tag name
       * @example 'div'
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * NFT collection id
       */
      nftCollectionId: {
        type: String,
        default: null
      },
      /**
       * Filter for items
       */
      filterItems: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        loading: false,
        ready: false,
        disabled: false
      };
    },

    computed: {
      /**
       * Get computed filter for items
       */
      getterFilter() {
        const filter = { ...this.filterItems };

        if (this.nftCollectionId) {
          filter._id = {
            ...filter._id,
            nftCollectionId: this.nftCollectionId
          };
        }

        return filter;
      },
      /**
       * Get computed NFT items list by filter
       */
      nftItemsList() {
        return this.$store.getters['nftItems/list'](this.getterFilter);
      },
      /**
       * Get computed slot properties
       */
      slotProps() {
        return {
          nftItemsList: this.nftItemsList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.getNftItems();
    },

    methods: {
      handleReady() {
        this.ready = true;
        /**
         * Triggers when the NFT items list is ready
         *
         * @property {Array.<Object>} nftItemsList
         */
        this.$emit('ready', this.nftItemsList);
      },
      /**
       * Get NFT item
       */
      async getNftItems() {
        this.loading = true;

        try {
          if (this.nftCollectionId) {
            await this.$store.dispatch('nftItems/getListByNftCollectionId',
                                       this.nftCollectionId);
          } else {
            await this.$store.dispatch('nftItems/getList');
          }
          this.handleReady();
        } catch (error) {
          console.error(error);
        }

        this.loading = false;
      }
    }
  });
</script>
