<template>
  <users-data-provider v-bind="providerProps" ref="dataProvider">
    <template #default="{ users }">
      <component
        :is="listComponent"
        :users="users"
        v-on="componentEvents"
      />
    </template>
  </users-data-provider>
</template>

<script>
  import { getBindableProps } from '@deip/vuetify-extended/lib/composables/props';
  import { componentViewType } from '@deip/platform-util';
  import UsersDataProvider from '../DataProvider/UsersDataProvider';

  import UsersListDefault from './UsersListDefault';
  import UsersListStack from './UsersListStack';

  export default {
    name: 'UsersList',
    components: {
      UsersDataProvider,
      UsersListDefault,
      UsersListStack
    },
    props: {
      ...UsersDataProvider.props,

      viewType: {
        type: String,
        default: ''
      }
    },

    computed: {
      providerProps() {
        return getBindableProps.call(this, UsersDataProvider.props);
      },

      listComponent() {
        return componentViewType.call(this);
      },

      componentEvents() {
        return {
          ...(this.$listeners['click-item'] ? { 'click-item': this.onClickItem } : {})
        };
      }
    },

    methods: {
      onClickItem(e) {
        this.$emit('click-item', e);
      }
    }
  };
</script>
