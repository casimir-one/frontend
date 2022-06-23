<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  /**
   * Project content drafts data provider
   */
  export default defineComponent({
    name: 'ProjectContentDraftsDataProvider',
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
        required: true
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
          filter.nftCollectionId = this.nftCollectionId;
        }

        return filter;
      },
      /**
       * Get computed project content drafts list
       */
      drafts() {
        return this.$store.getters['projectContentDrafts/list'](this.getterFilter);
      },
      /**
       * Get computed slot properties
       */
      slotProps() {
        return {
          drafts: this.drafts,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.getContent();
    },

    methods: {
      handleReady() {
        this.ready = true;
        /**
         * Triggers when the drafts list is ready
         *
         * @property {Array.<Object>} drafts
         */
        this.$emit('ready', this.drafts);
      },
      /**
       * Get project content drafts by NFT collection id
       */
      async getContent() {
        this.loading = true;

        try {
          await this.$store.dispatch('projectContentDrafts/getListByNftCollectionId',
                                     this.nftCollectionId);
          this.handleReady();
        } catch (error) {
          console.error(error);
        }

        this.loading = false;
      }
    }
  });
</script>
