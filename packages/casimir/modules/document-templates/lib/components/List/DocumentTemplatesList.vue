<script>
  import { defineComponent } from '@casimir/platform-util';

  import { AdminListPage, dateMixin } from '@casimir/platform-components';
  import DocumentTemplatesDataProvider from '../DataProvider/DocumentTemplatesDataProvider';

  export default defineComponent({
    name: 'DocumentTemplatesList',

    components: { DocumentTemplatesDataProvider },

    mixins: [AdminListPage, dateMixin],

    props: {
      /**
       * User or team account
       */
      account: {
        type: String,
        default: null
      },
      /**
       * Page title
       *
       * @example 'Documents'
       */
      pageTitle: {
        type: String,
        default: 'Documents'
      }
    },

    data() {
      return {
        headers: [
          {
            text: this.$t('module.documentTemplates.list.title'),
            value: 'title'
          },
          {
            text: this.$t('module.documentTemplates.list.created'),
            value: 'createdAt'
          },
          {
            align: 'end',
            sortable: false,
            value: 'actions'
          }
        ]
      };
    },

    methods: {
      /**
       * Format created date
       *
       * @param {string} date
       */
      formatCreatedDate(date) {
        return this.$$formatDate(this.$$parseISO(date));
      },
      /**
       * Generate table slots
       */
      genTableSlots() {
        return {
          'item.createdAt': ({ item }) => this.formatCreatedDate(item.createdAt),
          ...AdminListPage.options.methods.genTableSlots.call(this)
        };
      },
      /**
       * Generate provider
       */
      genProvider() {
        return (
          <DocumentTemplatesDataProvider
            account={this.account}
            scopedSlots={this.genProviderSlots('templates')}
          />
        );
      }
    }
  });
</script>
