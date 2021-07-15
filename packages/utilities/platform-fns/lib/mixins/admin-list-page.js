/* eslint-disable */
import {
  VIcon,
  VBtn,
  VDataTable
} from 'vuetify/lib/components';
/* eslint-enable */

// eslint-disable-next-line import/no-unresolved
import { VexSection, VexSectionTitle } from '@deip/vuetify-extended';

import { isFunction, pascalCase } from '@deip/toolbox';

export const defaultAdminListItemActions = () => [
  {
    icon: 'mdi-pencil',
    clickEvent: 'click-edit'
  },
  {
    icon: 'mdi-delete',
    clickEvent: 'click-remove'
  }
];

export const defaultAdminHeaderActions = () => [
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
    icon: 'mdi-puzzle-plus-outline',
    clickEvent: 'click-create',
    label: 'Create',
    props: {
      color: 'primary'
    }
  }
];

export const AdminListPage = {
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
    onClickEdit() {},

    genCtrl(data) {
      const {
        icon,
        label,
        clickEvent,
        action,
        item,
        props
      } = data;

      const onClick = () => {
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
          {icon ? <VIcon {...{ props: { ...(label ? { left: true } : {}) } }} small>{icon}</VIcon> : ''}
          {label || ''}
        </VBtn>
      );
    },

    // BLOCKS GENERATORS

    genTable(items, scopedSlots) {
      return (
        <VDataTable
          scopedSlots={scopedSlots}
          items={items}
          headers={this.headers}

          hideDefaultFooter={items.length < this.tableProps.itemsPerPage}
          footerProps={this.tableProps.footerProps}
          itemsPerPage={this.itemsPerPage}
        />
      );
    },

    genProvider() {
      return <div>No data provider</div>;
    },

    genWrapper() {
      return (
        <VexSection>
          <VexSectionTitle>
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
};
