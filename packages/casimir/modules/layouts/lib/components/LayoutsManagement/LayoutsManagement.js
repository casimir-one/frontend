import { defineComponent } from '@casimir/platform-util';
import { AdminListPage } from '@casimir/platform-components';
import { LayoutsDataProvider } from '../LayoutsDataProvider';

/**
 * Component for layouts management.
 * Consists of Create, Settings buttons and a table with a list of layouts and Edit, Delete buttons for each layout
 */
export default defineComponent({
  name: 'LayoutsManagement',
  mixins: [AdminListPage],

  props: {
    /**
     * Page title
     *
     * @example 'Layouts'
     */
    pageTitle: {
      type: String,
      default: 'Layouts'
    }
  },

  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Scope',
          value: 'scope'
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
     * Generate table slots
     */
    genTableSlots() {
      return {
        'item.scope': ({ item }) => this.$store.getters['scopesRegistry/one'](item.scope).label,
        ...AdminListPage.options.methods.genTableSlots.call(this)
      };
    },
    /**
     * Generate layouts data provider
     */
    genProvider() {
      return <LayoutsDataProvider scopedSlots={this.genProviderSlots('layouts')}/>;
    }
  }
});
