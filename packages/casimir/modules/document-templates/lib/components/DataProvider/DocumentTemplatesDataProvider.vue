<template>
  <component :is="tag">
    <!--
      @slot
      @binding {Object} slotProps
    -->
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';

  export default defineComponent({
    name: 'DocumentTemplatesDataProvider',

    props: {
      /**
       * Tag name
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * User or team account
       */
      account: {
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

        if (this.account) {
          filter.account = this.account;
        }

        return filter;
      },
      /**
       * Get computed list of document templates
       */
      dataList() {
        return this.$store.getters['documentTemplates/list'](this.getterFilter);
      },
      /**
       * Get computed binding slot properties
       */
      slotProps() {
        return {
          templates: this.dataList,

          loading: this.loading,
          ready: this.ready,
          disabled: this.disabled
        };
      }
    },

    created() {
      this.loadData();
    },

    methods: {
      /**
       * Load document templates list by account
       */
      loadData() {
        this.loading = true;

        this.$store.dispatch('documentTemplates/getListByAccount', this.account)
          .then(() => {
            this.loading = false;
            this.ready = true;
            /**
             * Triggers when document templates list is ready
             *
             * @type {Array.<Object>}
             */
            this.$emit('ready', this.dataList);
          });
      }
    }
  });
</script>
