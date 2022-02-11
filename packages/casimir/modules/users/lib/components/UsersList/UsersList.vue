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
  import { defineComponent, componentViewType } from '@deip/platform-util';

  import { UsersDataProvider } from '../UsersDataProvider';
  import { UsersListStack } from '../UsersListStack';

  export default defineComponent({
    name: 'UsersList',
    components: {
      UsersDataProvider,
      UsersListStack
    },
    props: {
      ...UsersDataProvider.options.props,

      viewType: {
        type: String,
        default: 'stack'
      }
    },

    computed: {
      providerProps() {
        return getBindableProps.call(this, UsersDataProvider.options.props);
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
  });
</script>
