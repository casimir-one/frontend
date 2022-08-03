<template>
  <div>
    <slot :list="list" />

    <infinite-loading :identifier="infiniteScrollId" @infinite="getList">
      <template #spinner>
        <v-progress-circular
          indeterminate
          class="my-8"
        />
      </template>

      <template #no-more>
        {{ $t('module.nftItems.nftItemsInfiniteScroll.noMore') }}
      </template>

      <template #no-results class="my-8">
        {{ $t('module.nftItems.nftItemsInfiniteScroll.noResults') }}
      </template>
    </infinite-loading>
  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';

  /** NFT items list with infinite scroll */
  export default {
    name: 'NftItemsInfiniteScroll',

    components: {
      InfiniteLoading
    },

    props: {
      /** Page size */
      pageSize: {
        type: Number,
        default: 10
      },

      /** Filter */
      filter: {
        type: Object,
        default: undefined
      },

      /** Sort */
      sort: {
        type: Object,
        default: undefined
      },

      /** Are NFT items drafts */
      isDraft: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        list: [],
        page: 0,
        infiniteScrollId: +new Date()
      };
    },

    watch: {
      filter() {
        this.resetInfiniteScroll();
      },
      sort() {
        this.resetInfiniteScroll();
      }
    },

    methods: {
      /**
       * Get NFT items list
       * @param {Object} scrollState
       * @param {Function} scrollState.loaded
       * @param {Function} scrollState.complete
       * @param {Function} scrollState.error
       * @param {Function} scrollState.reset
       */
      async getList(scrollState) {
        const query = {
          page: this.page,
          pageSize: this.pageSize
        };

        if (this.filter) query.filter = this.filter;
        if (this.sort) query.sort = this.sort;

        try {
          const { items } = (this.isDraft)
            ? await this.$store.dispatch('nftItemDrafts/getListPaginated', query)
            : await this.$store.dispatch('nftItems/getListPaginated', query);

          if (items.length) {
            this.list = this.list.concat(items);
            this.page++;

            const authorIds = items.map((nftItem) => nftItem.authors[0]);
            const uniqueAuthorIds = Array.from(new Set(authorIds));

            await this.$store.dispatch('users/getList', { users: uniqueAuthorIds });

            scrollState.loaded();
          } else {
            scrollState.complete();
          }
        } catch (error) {
          console.error(error);
        }
      },

      /** Reset infinite scroll */
      resetInfiniteScroll() {
        this.page = 0;
        this.list = [];
        this.infiniteScrollId += 1;
      }
    }
  };
</script>
