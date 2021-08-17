<template>
  <component :is="tag">
    <slot v-bind="slotProps" />
  </component>
</template>

<script>
  export default {
    name: 'DocumentTemplatesDataProvider',

    props: {
      tag: {
        type: String,
        default: 'div'
      },

      account: {
        type: String,
        default: null
      },

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
      getterFilter() {
        const filter = { ...this.filterItems };

        if (this.account) {
          filter.account = this.account;
        }

        return filter;
      },

      dataList() {
        return this.$store.getters['documentTemplates/list'](this.getterFilter);
      },

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
      loadData() {
        this.loading = true;

        this.$store.dispatch('documentTemplates/getListByAccount', this.account)
          .then(() => {
            this.loading = false;
            this.ready = true;

            this.$emit('ready', this.dataList);
          });
      }
    }
  };
</script>
