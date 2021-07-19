import { defineComponent } from '@deip/platform-util';
import { AdminListPage } from '@deip/platform-components';
import { ATTR_SCOPES_LABELS } from '@deip/constants';
import { LayoutsDataProvider } from '../data-provider';

export default defineComponent({
  name: 'LayoutsManagementTable',
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
        'item.scope': ({ item }) => ATTR_SCOPES_LABELS[item.scope],
        ...AdminListPage.options.methods.genTableSlots.call(this)
      };
    },

    genProvider() {
      return <LayoutsDataProvider scopedSlots={this.genProviderSlots('layouts')}/>;
    }
  }
});
