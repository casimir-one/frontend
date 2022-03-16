import { defineComponent } from '@deip/platform-util';
import { AdminListPage } from '@deip/platform-components';
import { LayoutsDataProvider } from '../LayoutsDataProvider';

/**
 * Component for managing layouts
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
