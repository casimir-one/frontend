import { defineComponent } from '@deip/platform-util';
import { AdminListPage } from '@deip/platform-components';
import { LayoutsDataProvider } from '../LayoutsDataProvider';

export default defineComponent({
  name: 'LayoutsManagement',
  mixins: [AdminListPage],

  props: {
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
    genTableSlots() {
      return {
        'item.scope': ({ item }) => this.$store.getters['attributesRegistry/scopesOne'](item.scope).label,
        ...AdminListPage.options.methods.genTableSlots.call(this)
      };
    },

    genProvider() {
      return <LayoutsDataProvider scopedSlots={this.genProviderSlots('layouts')}/>;
    }
  }
});
