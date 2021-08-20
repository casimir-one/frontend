<script>
  import { defineComponent } from '@deip/platform-util';

  import { AdminListPage, dateMixin } from '@deip/platform-components';
  import DocumentTemplatesDataProvider from '../DataProvider/DocumentTemplatesDataProvider';

  export default defineComponent({
    name: 'DocumentTemplatesList',

    components: { DocumentTemplatesDataProvider },

    mixins: [AdminListPage, dateMixin],

    props: {
      account: {
        type: String,
        default: null
      },
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
      formatCreatedDate(date) {
        return this.$$formatDate(this.$$parseISO(date));
      },

      genTableSlots() {
        return {
          'item.createdAt': ({ item }) => this.formatCreatedDate(item.createdAt),
          ...AdminListPage.options.methods.genTableSlots.call(this)
        };
      },

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
