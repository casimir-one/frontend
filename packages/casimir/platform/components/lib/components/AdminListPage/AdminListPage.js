/* eslint-disable */
import {
  VIcon,
  VBtn,
  VDataTable
} from 'vuetify/lib/components';
/* eslint-enable */

import { defineComponent } from '@casimir.one/platform-util';
import { isFunction, pascalCase } from '@casimir.one/toolbox';
import { VexSection, VexSectionTitle } from '@casimir.one/vuetify-extended';

/**
 * Generate default list item actions
 * @returns {Array} item actions
 */
const defaultAdminListItemActions = () => [
  {
    icon: 'mdi-pencil',
    clickEvent: 'click-edit'
  },
  {
    icon: 'mdi-delete',
    clickEvent: 'click-remove'
  }
];

/**
 * Generate default header action
 * @returns {Array}
 */
const defaultAdminHeaderActions = () => [
  {
    icon: 'mdi-tune-vertical',
    clickEvent: 'click-settings',
    label: 'Settings',
    props: {
      outlined: true,
      color: 'primary'
    }
  },
  {
    icon: 'mdi-plus',
    clickEvent: 'click-create',
    label: 'Create',
    props: {
      color: 'primary'
    }
  }
];

/**
 * Basic list component for admin pages
 */
const AdminListPage = defineComponent({
  name: 'AdminListPage',

  props: {
    itemActions: {
      type: Array,
      default: () => defaultAdminListItemActions()
    },
    headerActions: {
      type: Array,
      default: () => defaultAdminHeaderActions()
    },
    pageTitle: {
      type: String,
      default: 'Admin list'
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
          align: 'end',
          sortable: false,
          value: 'actions'
        }
      ],
      tableProps: {
        itemsPerPage: 50,
        footerProps: {
          itemsPerPageOptions: [5, 10, 20, 50, -1]
        }
      }
    };
  },

  methods: {
    genCtrl(data) {
      const {
        icon,
        label,
        clickEvent,
        action,
        item,
        props
      } = data;

      const onClick = (e) => {
        e.stopPropagation(); // .stop didn't work

        if (action && isFunction(action)) {
          action();
        } else {
          this.$emit(clickEvent, item);
          const onMethod = `on${pascalCase(clickEvent)}`;
          if (Object.prototype.hasOwnProperty.call(this, onMethod)) {
            this[onMethod](item);
          }
        }
      };

      const btnData = {
        staticClass: 'ml-2',
        props: {
          ...(label ? { small: true } : { xSmall: true }),
          ...(icon && !label ? { icon: true } : {}),
          ...props || {}
        },
        on: {
          click: onClick
        }
      };

      return (
        <VBtn {...btnData}>
          {icon
            ? <VIcon {...{ props: { ...(label ? { left: true } : {}) } }} small>{icon}</VIcon>
            : ''}
          {label || ''}
        </VBtn>
      );
    },

    // BLOCKS GENERATORS

    onRowClick(item) {
      this.$emit('click-row', item);
    },

    genTable(items, scopedSlots) {
      const listeners = {
        on: {
          'click:row': this.onRowClick
        }
      };

      return (
        <VDataTable
          scopedSlots={scopedSlots}
          items={items}
          headers={this.headers}

          hideDefaultFooter={items.length < this.tableProps.itemsPerPage}
          footerProps={this.tableProps.footerProps}
          itemsPerPage={this.tableProps.itemsPerPage}
          { ...listeners }
        />
      );
    },

    genProvider() {
      return <div>No data provider</div>;
    },

    genWrapper() {
      return (
        <VexSection>
          <VexSectionTitle staticClass="mb-8">
            {this.pageTitle}

            <template slot="append">
              {this.headerActions.map((act) => this.genCtrl(act))}
            </template>
          </VexSectionTitle>

          {this.genProvider()}
        </VexSection>
      );
    },

    // SLOTS GENERATORS

    genTableSlots() {
      return {
        'item.actions': ({ item }) => this.itemActions.map((act) => this.genCtrl({ item, ...act }))
      };
    },

    genProviderSlots(itemsKey = 'items') {
      return {
        default: ({
          [itemsKey]: items
        }) => this.genTable(items, this.genTableSlots())
      };
    }

  },

  render() {
    return this.genWrapper();
  }
});

export default AdminListPage;
